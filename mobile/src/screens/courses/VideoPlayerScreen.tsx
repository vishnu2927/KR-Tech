import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { Video, ResizeMode, AVPlaybackStatus } from "expo-av";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  ArrowLeft,
  Download,
  Check,
  Bookmark,
  MessageSquare,
  FastForward,
  Subtitles,
  Share2,
} from "lucide-react-native";
import { RootStackParamList } from "../../navigation/types";
import { Colors } from "../../theme/colors";
import { GlassCard } from "../../components/GlassCard";
import { useOffline } from "../../context/OfflineContext";
import { apiClient } from "../../services/apiClient";

type Props = NativeStackScreenProps<RootStackParamList, "VideoPlayer">;

const SPEEDS = [0.75, 1.0, 1.25, 1.5, 2.0];

export const VideoPlayerScreen: React.FC<Props> = ({ route, navigation }) => {
  const { lessonId, courseId, title, videoUrl } = route.params;
  const videoRef = useRef<Video>(null);
  const { downloadLessonVideo, isDownloaded, getDownloadedUri } = useOffline();

  const [status, setStatus] = useState<any>({});
  const [speedIndex, setSpeedIndex] = useState(1);
  const [isCaptionsOn, setIsCaptionsOn] = useState(true);
  const [bookmarks, setBookmarks] = useState<string[]>(["03:45 — Microservices IPC", "12:20 — Kafka Partitions"]);
  const [notes, setNotes] = useState("");
  const [savedNotes, setSavedNotes] = useState<string[]>([
    "Remember to configure consumer auto-offset reset to 'earliest' for idempotence.",
  ]);
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);

  // Check if offline file exists
  const offlineUri = getDownloadedUri(lessonId);
  const sourceUri = offlineUri || videoUrl;

  const toggleSpeed = async () => {
    const nextIndex = (speedIndex + 1) % SPEEDS.length;
    setSpeedIndex(nextIndex);
    const newRate = SPEEDS[nextIndex];
    if (videoRef.current) {
      await videoRef.current.setRateAsync(newRate, true);
    }
  };

  const handleDownload = async () => {
    try {
      setDownloadProgress(0.01);
      await downloadLessonVideo(lessonId, title, videoUrl, courseId, (p) => setDownloadProgress(p));
      setDownloadProgress(null);
      Alert.alert("Downloaded", "Lesson successfully saved for offline viewing.");
    } catch {
      setDownloadProgress(null);
      Alert.alert("Error", "Could not complete offline download.");
    }
  };

  const addBookmark = () => {
    const currentMillis = status?.positionMillis || 0;
    const minutes = Math.floor(currentMillis / 60000);
    const seconds = Math.floor((currentMillis % 60000) / 1000);
    const formatted = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    setBookmarks([...bookmarks, `${formatted} — Key Concept Note`]);
    Alert.alert("Bookmark Saved", `Timestamp ${formatted} saved to your study notes.`);
  };

  const saveNote = () => {
    if (!notes.trim()) return;
    setSavedNotes([...savedNotes, notes.trim()]);
    setNotes("");
    // Sync note with backend
    apiClient.post("/student-dashboard/notes", { lessonId, content: notes.trim() }).catch(() => {});
  };

  // Sync playback progress
  useEffect(() => {
    const interval = setInterval(() => {
      if (status?.positionMillis && status?.durationMillis) {
        const percent = Math.floor((status.positionMillis / status.durationMillis) * 100);
        apiClient.post("/student-dashboard/progress", { lessonId, percent }).catch(() => {});
      }
    }, 15000);
    return () => clearInterval(interval);
  }, [status]);

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={18} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.topTitle} numberOfLines={1}>{title}</Text>
      </View>

      {/* Video Player */}
      <View style={styles.videoBox}>
        <Video
          ref={videoRef}
          source={{ uri: sourceUri }}
          rate={SPEEDS[speedIndex]}
          volume={1.0}
          isMuted={false}
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay
          useNativeControls
          style={styles.video}
          onPlaybackStatusUpdate={(s) => setStatus(s)}
        />
        {isCaptionsOn && (
          <View style={styles.captionOverlay}>
            <Text style={styles.captionText}>[Captions: English (AI Generated) Active]</Text>
          </View>
        )}
      </View>

      {/* Control Quick Actions Bar */}
      <View style={styles.actionsBar}>
        <TouchableOpacity style={styles.actionBtn} onPress={toggleSpeed}>
          <FastForward size={16} color={Colors.textCyan} />
          <Text style={styles.actionBtnText}>{SPEEDS[speedIndex]}x</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => setIsCaptionsOn(!isCaptionsOn)}
        >
          <Subtitles size={16} color={isCaptionsOn ? Colors.textPurple : Colors.textMuted} />
          <Text style={styles.actionBtnText}>{isCaptionsOn ? "CC On" : "CC Off"}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={addBookmark}>
          <Bookmark size={16} color="#FBBF24" />
          <Text style={styles.actionBtnText}>Bookmark</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={handleDownload}
          disabled={isDownloaded(lessonId) || downloadProgress !== null}
        >
          {isDownloaded(lessonId) ? (
            <>
              <Check size={16} color={Colors.success} />
              <Text style={[styles.actionBtnText, { color: Colors.success }]}>Saved</Text>
            </>
          ) : downloadProgress !== null ? (
            <Text style={styles.actionBtnText}>{Math.round(downloadProgress * 100)}%</Text>
          ) : (
            <>
              <Download size={16} color={Colors.textPrimary} />
              <Text style={styles.actionBtnText}>Download</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Lesson Metadata */}
        <GlassCard style={styles.infoCard}>
          <Text style={styles.lessonName}>{title}</Text>
          <Text style={styles.subtext}>KR GLOBAL LEARNING PRIVATE LIMITED • Mentored Session</Text>
        </GlassCard>

        {/* Bookmarks Section */}
        <GlassCard style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Bookmarks ({bookmarks.length})</Text>
          {bookmarks.map((b, i) => (
            <View key={i} style={styles.bookmarkRow}>
              <Bookmark size={14} color="#FBBF24" />
              <Text style={styles.bookmarkText}>{b}</Text>
            </View>
          ))}
        </GlassCard>

        {/* Lesson Notes Section */}
        <GlassCard style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Interactive Lesson Notes</Text>
          <View style={styles.noteInputRow}>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="Take a quick note at this timestamp…"
              placeholderTextColor={Colors.textMuted}
              style={styles.noteInput}
            />
            <TouchableOpacity style={styles.saveNoteBtn} onPress={saveNote}>
              <Text style={styles.saveNoteText}>Add</Text>
            </TouchableOpacity>
          </View>

          {savedNotes.map((n, idx) => (
            <View key={idx} style={styles.savedNoteItem}>
              <MessageSquare size={13} color={Colors.secondary} />
              <Text style={styles.savedNoteText}>{n}</Text>
            </View>
          ))}
        </GlassCard>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 10,
    gap: 12,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  topTitle: { color: "#FFFFFF", fontSize: 14, fontWeight: "700", flex: 1 },
  videoBox: { width: "100%", height: 230, backgroundColor: "#000000", position: "relative" },
  video: { width: "100%", height: "100%" },
  captionOverlay: {
    position: "absolute",
    bottom: 8,
    alignSelf: "center",
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  captionText: { color: "#FFFFFF", fontSize: 11, fontStyle: "italic" },
  actionsBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "rgba(15, 23, 42, 0.9)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.08)",
    paddingVertical: 10,
  },
  actionBtn: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 10 },
  actionBtnText: { color: Colors.textSecondary, fontSize: 12, fontWeight: "700" },
  scroll: { padding: 16, gap: 14, paddingBottom: 60 },
  infoCard: { padding: 14, gap: 4 },
  lessonName: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
  subtext: { color: Colors.textMuted, fontSize: 11 },
  sectionCard: { padding: 14, gap: 10 },
  sectionTitle: { color: "#FFFFFF", fontSize: 14, fontWeight: "700" },
  bookmarkRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  bookmarkText: { color: Colors.textSecondary, fontSize: 12 },
  noteInputRow: { flexDirection: "row", gap: 8 },
  noteInput: {
    flex: 1,
    backgroundColor: Colors.inputBackground,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    color: "#FFFFFF",
    fontSize: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  saveNoteBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  saveNoteText: { color: "#FFFFFF", fontSize: 12, fontWeight: "700" },
  savedNoteItem: { flexDirection: "row", gap: 8, alignItems: "flex-start", marginTop: 4 },
  savedNoteText: { color: Colors.textSecondary, fontSize: 12, flex: 1, lineHeight: 18 },
});
