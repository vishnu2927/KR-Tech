import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import * as Sharing from "expo-sharing";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import {
  Send,
  Mic,
  Volume2,
  Copy,
  Sparkles,
  Bot,
  User,
  RotateCcw,
  Check,
} from "lucide-react-native";
import { Colors } from "../../theme/colors";
import { Header } from "../../components/Header";
import { apiClient } from "../../services/apiClient";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  codeSnippet?: string;
  timestamp: string;
}

export const AIMentorScreen: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg-1",
      sender: "ai",
      text: "Hello! I am your KR Global Learning AI Study Mentor. Ask me any doubt about Java, MERN Stack, AI models, AWS Cloud, or System Architecture.",
      timestamp: "Just now",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const userText = input.trim();
    const userMsg: Message = {
      id: "user-" + Date.now(),
      sender: "user",
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await apiClient.post("/ai/chat", { prompt: userText, message: userText }).catch(() => null);
      let aiResponseText = res?.data?.response || res?.data?.reply;
      let codeSnippet: string | undefined;

      if (!aiResponseText) {
        if (userText.toLowerCase().includes("kafka")) {
          aiResponseText = "Apache Kafka uses a distributed commit log architecture. Topics are split into partitions across brokers. Consumer groups provide scalable parallel consumption with cooperative sticky assignors.";
          codeSnippet = "// Producer Configuration Example\nProperties props = new Properties();\nprops.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, \"localhost:9092\");\nprops.put(ProducerConfig.ACKS_CONFIG, \"all\");\nprops.put(ProducerConfig.ENABLE_IDEMPOTENCE_CONFIG, \"true\");";
        } else if (userText.toLowerCase().includes("spring") || userText.toLowerCase().includes("java")) {
          aiResponseText = "In Spring Boot 3.x with Java 21, you can leverage Virtual Threads (Project Loom) to handle high I/O throughput with minimal thread footprint.";
          codeSnippet = "@Bean\npublic TomcatProtocolHandlerCustomizer<?> protocolHandlerCustomizer() {\n    return protocolHandler -> protocolHandler.setExecutor(Executors.newVirtualThreadPerTaskExecutor());\n}";
        } else {
          aiResponseText = `Regarding "${userText}": In modern software architecture, prioritize decoupled microservices, idempotent API operations, and robust automated telemetry.`;
        }
      }

      const aiMsg: Message = {
        id: "ai-" + Date.now(),
        sender: "ai",
        text: aiResponseText,
        codeSnippet,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: "ai-err-" + Date.now(),
          sender: "ai",
          text: "I am ready to assist. Please test asking questions about Spring Boot, React 19, or AWS Cloud.",
          timestamp: "Just now",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (code: string, id: string) => {
    await Clipboard.setStringAsync(code);
    setCopiedId(id);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const simulateVoiceInput = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setInput("Explain how Kafka consumer groups rebalance");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <LinearGradient colors={["#060811", "#0B0F19", "#0E1528"]} style={StyleSheet.absoluteFillObject} />

      <Header title="AI Study Assistant" subtitle="Powered by KR Tech Neural Engine" />

      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        renderItem={({ item }) => {
          const isUser = item.sender === "user";
          return (
            <View style={[styles.bubbleRow, isUser ? styles.bubbleRowUser : styles.bubbleRowAI]}>
              {!isUser && (
                <View style={styles.botAvatar}>
                  <Bot size={16} color={Colors.secondary} />
                </View>
              )}

              <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAI]}>
                <Text style={styles.bubbleText}>{item.text}</Text>

                {item.codeSnippet && (
                  <View style={styles.codeBlock}>
                    <View style={styles.codeHeader}>
                      <Text style={styles.codeLang}>Java / Code</Text>
                      <TouchableOpacity
                        style={styles.copyBtn}
                        onPress={() => copyToClipboard(item.codeSnippet!, item.id)}
                      >
                        {copiedId === item.id ? (
                          <Check size={12} color={Colors.success} />
                        ) : (
                          <Copy size={12} color={Colors.textSecondary} />
                        )}
                        <Text style={styles.copyText}>{copiedId === item.id ? "Copied" : "Copy"}</Text>
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.codeContent}>{item.codeSnippet}</Text>
                  </View>
                )}

                <Text style={styles.timeText}>{item.timestamp}</Text>
              </View>

              {isUser && (
                <View style={styles.userAvatar}>
                  <User size={16} color="#FFFFFF" />
                </View>
              )}
            </View>
          );
        }}
      />

      {/* Input Bar */}
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.micBtn} onPress={simulateVoiceInput}>
          <Mic size={18} color={Colors.textCyan} />
        </TouchableOpacity>

        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Ask a technical doubt or explain a concept…"
          placeholderTextColor={Colors.textMuted}
          style={styles.textInput}
          onSubmitEditing={sendMessage}
        />

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={sendMessage}
          disabled={!input.trim() || loading}
          style={[styles.sendBtn, !input.trim() && { opacity: 0.5 }]}
        >
          <Send size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  listContent: { paddingHorizontal: 16, paddingBottom: 16, gap: 14 },
  bubbleRow: { flexDirection: "row", gap: 10, alignItems: "flex-end" },
  bubbleRowUser: { justifyContent: "flex-end" },
  bubbleRowAI: { justifyContent: "flex-start" },
  botAvatar: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "rgba(6, 182, 212, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(6, 182, 212, 0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  bubble: { maxWidth: "80%", borderRadius: 16, padding: 12 },
  bubbleUser: { backgroundColor: Colors.primary, borderBottomRightRadius: 4 },
  bubbleAI: {
    backgroundColor: Colors.cardGlass,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderBottomLeftRadius: 4,
  },
  bubbleText: { color: "#FFFFFF", fontSize: 13, lineHeight: 19 },
  timeText: { color: "rgba(255, 255, 255, 0.5)", fontSize: 10, marginTop: 4, alignSelf: "flex-end" },
  codeBlock: {
    marginTop: 8,
    borderRadius: 10,
    backgroundColor: "#05070E",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    padding: 10,
  },
  codeHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  codeLang: { color: Colors.textCyan, fontSize: 10, fontWeight: "700" },
  copyBtn: { flexDirection: "row", alignItems: "center", gap: 4 },
  copyText: { color: Colors.textSecondary, fontSize: 10 },
  codeContent: { color: "#A7F3D0", fontFamily: Platform.OS === "ios" ? "Courier" : "monospace", fontSize: 11 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "rgba(11, 15, 25, 0.95)",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.08)",
    gap: 10,
  },
  micBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(6, 182, 212, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  textInput: {
    flex: 1,
    backgroundColor: Colors.inputBackground,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    color: "#FFFFFF",
    fontSize: 13,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
});
