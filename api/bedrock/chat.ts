import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || "us-west-2",
});

const SYSTEM_PROMPT = `Eres un asistente técnico experto en APIUBL2.1 y facturación electrónica en Colombia. 
Tu objetivo es ayudar a los desarrolladores a comprender y usar correctamente el API de MATIAS para emisión de facturas electrónicas.

Contexto técnico importante:
- Las facturas usan estructura JSON con campos como: type_document_id, operation_type_id, customer, lines, legal_monetary_totals
- Los documentos en Colombia tienen hasta 10 dígitos (sin incluir dígito verificador)
- Los descuentos se aplican usando allowance_charges dentro de cada línea
- Los totales deben calcularse como: line_extension_amount (cantidad × precio - descuentos) + impuestos
- Los NITs se validan usando un algoritmo específico con pesos: [3, 7, 13, 17, 19, 23, 29, 37, 41, 43...]

Tópicos que puedes ayudar:
1. Estructura de facturas electrónicas
2. Validación de NITs y documentos
3. Cálculo de totales e impuestos (IVA, ReteIVA, etc.)
4. Ejemplos de JSON para diferentes tipos de transacciones
5. Errores comunes y cómo resolverlos
6. Integración del API MATIAS
7. Campos requeridos y opcionales
8. Tipos de documentos soportados (Factura, Nota Crédito, Nota Débito, etc.)

Responde siempre en español, de manera clara y concisa. Si la pregunta no está relacionada con APIUBL2.1, amablemente redirecciona al usuario.
Incluye ejemplos de código JSON cuando sea apropiado.`;

async function chat(
  userMessage: string,
  conversationHistory: Message[]
): Promise<string> {
  try {
    // Construir el historial de conversación con el nuevo mensaje
    const messages: Message[] = [
      ...conversationHistory,
      { role: "user", content: userMessage },
    ];

    // Formatear mensajes para Bedrock
    const formattedMessages = messages.map((msg) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    }));

    const command = new InvokeModelCommand({
      modelId: process.env.AWS_BEDROCK_DEFAULT_MODEL || "anthropic.claude-3-haiku-20240307-v1:0",
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-06-01",
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: formattedMessages,
      }),
    });

    const response = await client.send(command);

    // Parsear la respuesta
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    const assistantMessage =
      responseBody.content[0].type === "text" ? responseBody.content[0].text : "";

    return assistantMessage;
  } catch (error) {
    console.error("Bedrock error:", error);
    throw new Error(
      `Error al conectar con el asistente: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

export { chat, SYSTEM_PROMPT };
