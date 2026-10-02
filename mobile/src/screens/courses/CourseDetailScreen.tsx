import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import {
  ArrowLeft,
  Star,
  Clock,
  BookOpen,
  Award,
  CheckCircle2,
  Play,
  Share2,
  Heart,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ShieldCheck,
} from "lucide-react-native";
import { RootStackParamList } from "../../navigation/types";
import { Colors } from "../../theme/colors";
import { GlassCard } from "../../components/GlassCard";
import { GradientButton } from "../../components/GradientButton";

type Props = NativeStackScreenProps<RootStackParamList, "CourseDetail">;

export const CourseDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { title } = route.params;
  const [activeTab, setActiveTab] = useState<"syllabus" | "mentor" | "reviews">("syllabus");
  const [expandedModule, setExpandedModule] = useState<number | null>(0);
  const [isWish, setIsWish] = useState(false);

  const modules = [
    {
      title: "Module 1: Advanced Clean Architecture & Design Patterns",
      lessons: [
        "Domain-Driven Design (DDD) & Hexagonal Pattern",
        "Repository & Unit-of-Work in Microservices",
        "CQRS Pattern & Event Sourcing Essentials",
      ],
    },
    {
      title: "Module 2: Event-Driven Systems with Apache Kafka",
      lessons: [
        "Kafka Topics, Partitions & Consumer Groups",
        "Idempotent Producers & Exactly-Once Semantics",
        "Schema Registry & Avro Serializations",
      ],
    },
    {
      title: "Module 3: Cloud Native Infrastructure (AWS + Docker)",
      lessons: [
        "Docker Multi-Stage Builds & Security Scanning",
        "AWS ECS Fargate & CloudWatch Telemetry",
        "CI/CD Pipeline with GitHub Actions & Terraform",
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#060811", "#0B0F19", "#0E1528"]} style={StyleSheet.absoluteFillObject} />

      {/* Top Navbar */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={18} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.navTitle} numberOfLines={1}>{title}</Text>
        <View style={styles.navRight}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => setIsWish(!isWish)}>
            <Heart size={18} color={isWish ? Colors.error : "#FFFFFF"} fill={isWish ? Colors.error : "transparent"} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={() => Alert.alert("Share", `Enroll in ${title} at KR Global Learning!`)}>
            <Share2 size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Preview Video / Thumbnail Card */}
        <View style={styles.videoPreview}>
          <Image
            source={{ uri: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=450&fit=crop" }}
            style={styles.previewImage}
          />
          <TouchableOpacity
            style={styles.playButtonOverlay}
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate("VideoPlayer", {
                lessonId: "preview-1",
                courseId: "course-preview",
                title: "Curriculum Preview: " + title,
                videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
              })
            }
          >
            <Play size={24} color="#FFFFFF" fill="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.previewTag}>
            <Text style={styles.previewTagText}>WATCH FREE DEMO PREVIEW</Text>
          </View>
        </View>

        {/* Title & Metadata */}
        <View style={styles.metaSection}>
          <View style={styles.badgeRow}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>ISO 9001:2015 ACCREDITED</Text>
            </View>
            <View style={styles.ratingBadge}>
              <Star size={13} color="#FBBF24" fill="#FBBF24" />
              <Text style={styles.ratingValue}>4.98 (1,850+ ratings)</Text>
            </View>
          </View>

          <Text style={styles.courseHeading}>{title}</Text>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Clock size={14} color={Colors.textPurple} />
              <Text style={styles.statText}>18 Weeks</Text>
            </View>
            <View style={styles.statItem}>
              <BookOpen size={14} color={Colors.secondary} />
              <Text style={styles.statText}>28 Modules</Text>
            </View>
            <View style={styles.statItem}>
              <Award size={14} color="#FBBF24" />
              <Text style={styles.statText}>Certificate</Text>
            </View>
          </View>
        </View>

        {/* Navigation Tabs */}
        <View style={styles.tabRow}>
          {(["syllabus", "mentor", "reviews"] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab 1: Syllabus */}
        {activeTab === "syllabus" && (
          <View style={styles.syllabusContainer}>
            {modules.map((m, index) => {
              const isOpen = expandedModule === index;
              return (
                <GlassCard key={index} style={styles.moduleCard}>
                  <TouchableOpacity
                    style={styles.moduleHeader}
                    onPress={() => setExpandedModule(isOpen ? null : index)}
                  >
                    <Text style={styles.moduleTitle}>{m.title}</Text>
                    {isOpen ? (
                      <ChevronUp size={18} color={Colors.textSecondary} />
                    ) : (
                      <ChevronDown size={18} color={Colors.textSecondary} />
                    )}
                  </TouchableOpacity>

                  {isOpen && (
                    <View style={styles.lessonsList}>
                      {m.lessons.map((lesson, lIdx) => (
                        <View key={lIdx} style={styles.lessonItem}>
                          <CheckCircle2 size={15} color={Colors.success} />
                          <Text style={styles.lessonName}>{lesson}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </GlassCard>
              );
            })}
          </View>
        )}

        {/* Tab 2: Mentor */}
        {activeTab === "mentor" && (
          <GlassCard style={styles.mentorCard}>
            <View style={styles.mentorRow}>
              <Image
                source={{ uri: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop&crop=faces" }}
                style={styles.mentorAvatar}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.mentorName}>Rajesh Kumar</Text>
                <Text style={styles.mentorRole}>Principal Systems Architect</Text>
                <Text style={styles.mentorExp}>Ex-Amazon, Razorpay • 14+ Years Experience</Text>
              </View>
            </View>
            <Text style={styles.mentorBio}>
              Specializes in distributed transaction processing, Kafka event streams, and cloud microservices. Led architecture for 10M+ daily transactions.
            </Text>
          </GlassCard>
        )}

        {/* Tab 3: Reviews */}
        {activeTab === "reviews" && (
          <View style={{ gap: 10 }}>
            <GlassCard style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewerName}>Ananya Deshmukh</Text>
                <View style={{ flexDirection: "row", gap: 2 }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={12} color="#FBBF24" fill="#FBBF24" />
                  ))}
                </View>
              </View>
              <Text style={styles.reviewComment}>
                "The One-on-One code review sessions with Rajesh transformed how I structure distributed backends. Helped me clear Senior SDE rounds!"
              </Text>
            </GlassCard>
          </View>
        )}

        {/* Free Consultation Callout */}
        <GlassCard variant="cyan" style={styles.ctaBox}>
          <Sparkles size={20} color={Colors.textCyan} />
          <View style={{ flex: 1 }}>
            <Text style={styles.ctaTitle}>Free One-on-One Learning Consultation</Text>
            <Text style={styles.ctaSub}>Talk directly with a senior mentor before enrolling.</Text>
          </View>
        </GlassCard>
      </ScrollView>

      {/* Fixed Bottom Enroll Dock */}
      <View style={styles.bottomDock}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Full Course Access</Text>
          <Text style={styles.priceValue}>₹14,999 <Text style={styles.mrp}>₹24,999</Text></Text>
        </View>

        <GradientButton
          title="Enroll Now"
          onPress={() => navigation.navigate("PaymentCenter")}
          style={{ flex: 1 }}
          size="md"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  navTitle: { color: "#FFFFFF", fontSize: 15, fontWeight: "700", flex: 1, marginHorizontal: 10 },
  navRight: { flexDirection: "row", gap: 8 },
  scroll: { paddingBottom: 120 },
  videoPreview: { width: "100%", height: 210, position: "relative" },
  previewImage: { width: "100%", height: "100%", resizeMode: "cover" },
  playButtonOverlay: {
    position: "absolute",
    top: "38%",
    left: "44%",
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(124, 58, 237, 0.9)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 8,
  },
  previewTag: {
    position: "absolute",
    bottom: 10,
    left: 14,
    backgroundColor: "rgba(6, 182, 212, 0.85)",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
  },
  previewTagText: { color: "#FFFFFF", fontSize: 10, fontWeight: "800", letterSpacing: 0.5 },
  metaSection: { padding: 16, gap: 10 },
  badgeRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  tag: {
    backgroundColor: "rgba(124, 58, 237, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(124, 58, 237, 0.3)",
  },
  tagText: { color: Colors.textPurple, fontSize: 10, fontWeight: "700" },
  ratingBadge: { flexDirection: "row", alignItems: "center", gap: 5 },
  ratingValue: { color: "#FBBF24", fontSize: 12, fontWeight: "700" },
  courseHeading: { color: "#FFFFFF", fontSize: 22, fontWeight: "800", lineHeight: 28 },
  statsRow: { flexDirection: "row", gap: 16, marginTop: 4 },
  statItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  statText: { color: Colors.textSecondary, fontSize: 12, fontWeight: "600" },
  tabRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.08)",
    paddingHorizontal: 16,
    marginTop: 10,
  },
  tabBtn: { paddingVertical: 12, marginRight: 20 },
  tabBtnActive: { borderBottomWidth: 2, borderBottomColor: Colors.secondary },
  tabText: { color: Colors.textMuted, fontSize: 13, fontWeight: "700" },
  tabTextActive: { color: Colors.textCyan },
  syllabusContainer: { padding: 16, gap: 10 },
  moduleCard: { padding: 14 },
  moduleHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  moduleTitle: { color: "#FFFFFF", fontSize: 13, fontWeight: "700", flex: 1, paddingRight: 8 },
  lessonsList: { marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: "rgba(255, 255, 255, 0.06)", gap: 8 },
  lessonItem: { flexDirection: "row", alignItems: "center", gap: 8 },
  lessonName: { color: Colors.textSecondary, fontSize: 12 },
  mentorCard: { margin: 16, padding: 16, gap: 12 },
  mentorRow: { flexDirection: "row", gap: 12, alignItems: "center" },
  mentorAvatar: { width: 56, height: 56, borderRadius: 16 },
  mentorName: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
  mentorRole: { color: Colors.textCyan, fontSize: 12, fontWeight: "600" },
  mentorExp: { color: Colors.textMuted, fontSize: 11, marginTop: 2 },
  mentorBio: { color: Colors.textSecondary, fontSize: 12, lineHeight: 18 },
  reviewCard: { marginHorizontal: 16, padding: 14, gap: 6 },
  reviewHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  reviewerName: { color: "#FFFFFF", fontSize: 13, fontWeight: "700" },
  reviewComment: { color: Colors.textSecondary, fontSize: 12, lineHeight: 18 },
  ctaBox: { marginHorizontal: 16, marginTop: 12, padding: 14, flexDirection: "row", alignItems: "center", gap: 12 },
  ctaTitle: { color: "#FFFFFF", fontSize: 13, fontWeight: "700" },
  ctaSub: { color: Colors.textSecondary, fontSize: 11, marginTop: 2 },
  bottomDock: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(11, 15, 25, 0.96)",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.08)",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 28,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  priceContainer: { minWidth: 100 },
  priceLabel: { color: Colors.textMuted, fontSize: 10 },
  priceValue: { color: "#FFFFFF", fontSize: 18, fontWeight: "800" },
  mrp: { color: Colors.textMuted, fontSize: 12, textDecorationLine: "line-through" },
});
