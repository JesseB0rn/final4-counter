// stores/useMessageStore.ts
import { defineStore } from "pinia";
import { ref } from "vue";

type Role = "admin" | "display";
type MessageType = "update" | "ping" | "custom";

interface BroadcastMessage {
  from: Role;
  to?: Role | "all";
  type: MessageType;
  payload?: any;
}

export const useMessageStore = defineStore("message", () => {
  const role = ref<Role | null>(null);
  const messages = ref<BroadcastMessage[]>([]);
  const lastMessage = ref<BroadcastMessage | null>(null);

  const channel = new BroadcastChannel("hdmi-messaging");

  const setRole = (newRole: Role) => {
    role.value = newRole;
  };

  const sendMessage = (msg: Omit<BroadcastMessage, "from">) => {
    if (!role.value) throw new Error("Role not set before sending messages.");
    const fullMsg: BroadcastMessage = {
      ...msg,
      from: role.value,
    };
    channel.postMessage(fullMsg);
  };

  channel.onmessage = (event: MessageEvent<BroadcastMessage>) => {
    const msg = event.data;

    // Ignore messages not intended for this tab
    if (msg.to && msg.to !== role.value && msg.to !== "all") return;

    lastMessage.value = msg;
    messages.value.push(msg);

    // Optional: handle common message types directly here
    if (msg.type === "ping") {
      console.log(`[${role.value}] Received ping:`, msg.payload);
    }
  };

  return {
    role,
    setRole,
    sendMessage,
    messages,
    lastMessage,
  };
});
