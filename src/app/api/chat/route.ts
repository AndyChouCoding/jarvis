import { rootAgent } from "@/../agent";
import { Runner, InMemorySessionService } from "@google/adk";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    
    // Initialize session service
    const sessionService = new InMemorySessionService();
    await sessionService.createSession({ appName: "jarvis", sessionId: "session-1", userId: "user-1" });

    const runner = new Runner({
        appName: "jarvis",
        agent: rootAgent,
        sessionService: sessionService,
    });

    const iterator = runner.runAsync({
        userId: "user-1",
        sessionId: "session-1",
        newMessage: { role: "user", parts: [{ text: message }] } as any,
    });

    let lastResponse = "";
    
    for await (const event of iterator) {
        // console.log("Full Event Payload:", JSON.stringify(event, null, 2));
        // @ts-ignore
        if ((event as any).errorCode) {
            // @ts-ignore
            lastResponse = `Error: ${(event as any).errorMessage}`;
        }
        // @ts-ignore
        else if (event.content?.parts) {
            // @ts-ignore
            const text = event.content.parts.map((p: any) => p.text).join("");
            if (text) {
                lastResponse = text;
            }
        }
    }

    if (!lastResponse) {
       // If standard accumulation failed, try finding the last event
       // Or simply return a placeholder if debugging
       // In a real app we'd fully type the events
       lastResponse = "Response received (check server logs for details if empty)";
    }

    return Response.json({ response: lastResponse });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to process message" }, { status: 500 });
  }
}
