import type { NextApiRequest, NextApiResponse } from 'next';
import { chat } from './chat';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface RequestBody {
  message: string;
  conversationHistory: Message[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, conversationHistory = [] }: RequestBody = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Invalid message' });
    }

    // Limitar el historial para evitar context window demasiado grande
    const limitedHistory = conversationHistory.slice(-10);

    // Obtener respuesta de Bedrock
    const response = await chat(message, limitedHistory);

    return res.status(200).json({
      response,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
}
