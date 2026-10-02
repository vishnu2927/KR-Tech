import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  FileText,
  Download,
  Check,
  Search,
  Bookmark,
  Sparkles,
  Share2,
} from "lucide-react-native";
import { Colors } from "../../theme/colors";
import { GlassCard } from "../../components/GlassCard";
import { Header } from "../../components/Header";
import { useOffline } from "../../context/OfflineContext";

interface NoteDoc {
  id: string;
  title: string;
  category: string;
  pages: number;
  size: string;
  pdfUrl: string;
}

const STATIC_NOTES: NoteDoc[] = [
  {
    id: "note-spring-boot",
    title: "Spring Boot 3.x & Virtual Threads Architecture",
    category: "Full Stack",
    pages: 18,
    size: "2.4 MB",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  },
  {
    id: "note-kafka-streams",
    title: "Kafka Event Broker & Partitioning Playbook",
    category: "System Design",
    pages: 24,
    size: "3.1 MB",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  },
  {
    id: "note-aws-solutions",
    title: "AWS Solutions Architect Associate SAA-C03 Cheatsheet",
    category: "Cloud",
    pages: 32,
    size: "4.8 MB",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  },
  {
    id: "note-react19",
    title: "React 19 Server Components & Actions Guide",
    category: "Full Stack",
    pages: 14,
    size: "1.9 MB",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  },
];

export const NotesLibraryScreen: React.FC = () => {
  const { downloadPdfDocument, isDownloaded } = useOffline();
  const [search, setSearch] = useState("");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownloadPdf = async (note: NoteDoc) => {
    setDownloadingId(note.id);
    try {
      await downloadPdfDocument(note.id, note.title, note.pdfUrl, "pdf");
      Alert.alert("Saved Offline", `"${note.title}" is now available in your Download Center.`);
    } catch {
      Alert.alert("Error", "Could not download document.");
    } finally {
      setDownloadingId(null);
    }
  };

  const filtered = STATIC_NOTES.filter((n) =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#060811", "#0B0F19", "#0E1528"]} style={StyleSheet.absoluteFillObject} />

      <Header title="Notes & Cheatsheets" subtitle="Official KR Global Learning Study PDFs" />

      {/* Search Bar */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Search size={18} color={Colors.textMuted} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search notes by topic or keyword…"
            placeholderTextColor={Colors.textMuted}
            style={styles.searchInput}
          />
        </View>
      </View>

      {/* Notes List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const downloaded = isDownloaded(item.id);
          const isBusy = downloadingId === item.id;

          return (
            <GlassCard style={styles.noteCard}>
              <View style={styles.noteIconBadge}>
                <FileText size={22} color={Colors.textCyan} />
              </View>

              <View style={{ flex: 1, gap: 4 }}>
                <View style={styles.tagRow}>
                  <Text style={styles.catTag}>{item.category}</Text>
                  <Text style={styles.pageText}>{item.pages} Pages • {item.size}</Text>
                </View>

                <Text style={styles.noteTitle}>{item.title}</Text>
              </View>

              <TouchableOpacity
                style={[styles.downloadBtn, downloaded && styles.downloadBtnSaved]}
                onPress={() => handleDownloadPdf(item)}
                disabled={downloaded || isBusy}
              >
                {downloaded ? (
                  <Check size={16} color={Colors.success} />
                ) : (
                  <Download size={16} color={isBusy ? Colors.textMuted : "#FFFFFF"} />
                )}
              </TouchableOpacity>
            </GlassCard>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  searchRow: { paddingHorizontal: 16, marginBottom: 12 },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: Colors.inputBackground,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  searchInput: { flex: 1, color: "#FFFFFF", fontSize: 13 },
  list: { paddingHorizontal: 16, paddingBottom: 40, gap: 12 },
  noteCard: { flexDirection: "row", alignItems: "center", gap: 14, padding: 14 },
  noteIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(6, 182, 212, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  tagRow: { flexDirection: "row", justifyContent: "space-between" },
  catTag: { color: Colors.textPurple, fontSize: 10, fontWeight: "700" },
  pageText: { color: Colors.textMuted, fontSize: 10 },
  noteTitle: { color: "#FFFFFF", fontSize: 13, fontWeight: "700", lineHeight: 18 },
  downloadBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  downloadBtnSaved: {
    backgroundColor: "rgba(16, 185, 129, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.4)",
  },
});
