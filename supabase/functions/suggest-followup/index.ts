import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { prospect } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const activitiesText = (prospect.activities || [])
      .map((a: { date: string; text: string }) => `- ${a.date}: ${a.text}`)
      .join("\n");

    const systemPrompt = `Tu es un assistant commercial expert en prospection B2B. Tu dois suggérer des actions de suivi concrètes et personnalisées pour un prospect.

Règles :
- Réponds en français
- Donne exactement 3 suggestions courtes et actionnables (1-2 phrases max chacune)
- Adapte tes suggestions au statut actuel et à l'historique
- Sois spécifique (mentionne des délais, canaux, etc.)
- Format : retourne un JSON avec un tableau "suggestions", chaque élément ayant "icon" (emoji), "title" (court) et "description" (action détaillée)`;

    const userPrompt = `Prospect : ${prospect.name}
Secteur : ${prospect.sector}
Ville : ${prospect.city}
Statut : ${prospect.status}
Note Google : ${prospect.rating || "N/A"} (${prospect.reviewCount || "0"} avis)
Lien démo : ${prospect.demoLink || "Non envoyé"}
Prix proposé : ${prospect.proposedPrice || "Non défini"}
Date de création : ${prospect.createdAt}

Historique d'activité :
${activitiesText || "Aucune activité enregistrée"}

Génère 3 suggestions de suivi adaptées.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "return_suggestions",
              description: "Return follow-up suggestions for a prospect",
              parameters: {
                type: "object",
                properties: {
                  suggestions: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        icon: { type: "string", description: "An emoji representing the action" },
                        title: { type: "string", description: "Short action title" },
                        description: { type: "string", description: "Detailed action description" },
                      },
                      required: ["icon", "title", "description"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["suggestions"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "return_suggestions" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Trop de requêtes, réessayez dans un instant." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Crédits IA épuisés." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Erreur IA" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    let suggestions = [];

    if (toolCall?.function?.arguments) {
      const parsed = JSON.parse(toolCall.function.arguments);
      suggestions = parsed.suggestions || [];
    }

    return new Response(JSON.stringify({ suggestions }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("suggest-followup error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erreur inconnue" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
