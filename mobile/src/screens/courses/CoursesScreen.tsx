import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import {
  Search,
  Heart,
  Star,
  Clock,
  BookOpen,
  Filter,
  CheckCircle,
  WifiOff,
} from "lucide-react-native";
import { RootStackParamList } from "../../navigation/types";
import { Colors } from "../../theme/colors";
import { GlassCard } from "../../components/GlassCard";
import { Header } from "../../components/Header";
import { useOffline } from "../../context/OfflineContext";
import { apiClient } from "../../services/apiClient";

type NavProp = NativeStackNavigationProp<RootStackParamList>;

interface Course {
  id: string;
  title: string;
  category: string;
  rating: number;
  studentsCount: number;
  duration: string;
  modulesCount: number;
  thumbnail: string;
  isPopular?: boolean;
}

const CATEGORIES = ["All", "Full Stack", "Cloud & DevOps", "AI & Data", "Cyber Security", "SAP & ERP"];

const STATIC_COURSES: Course[] = [
  {
    id: "mern-stack",
    title: "MERN Stack Engineering & Microservices",
    category: "Full Stack",
    rating: 4.95,
    studentsCount: 1420,
    duration: "16 Weeks",
    modulesCount: 24,
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&h=300&fit=crop",
    isPopular: true,
  },
  {
    id: "java-fullstack",
    title: "Java Full Stack & Spring Boot Microservices",
    category: "Full Stack",
    rating: 4.98,
    studentsCount: 1850,
    duration: "18 Weeks",
    modulesCount: 28,
    thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop",
    isPopular: true,
  },
  {
    id: "aws-cloud",
    title: "AWS Certified Solutions Architect & DevOps",
    category: "Cloud & DevOps",
    rating: 4.92,
    studentsCount: 1200,
    duration: "14 Weeks",
    modulesCount: 20,
    thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&h=300&fit=crop",
  },
  {
    id: "cyber-security",
    title: "Cyber Security Specialist & Ethical Hacking",
    category: "Cyber Security",
    rating: 4.89,
    studentsCount: 940,
    duration: "14 Weeks",
    modulesCount: 18,
    thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&h=300&fit=crop",
  },
  {
    id: "ai-llm-eng",
    title: "AI & LLM Orchestration with Python & LangChain",
    category: "AI & Data",
    rating: 4.97,
    studentsCount: 880,
    duration: "12 Weeks",
    modulesCount: 16,
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&h=300&fit=crop",
    isPopular: true,
  },
  {
    id: "sap-fico",
    title: "SAP S/4HANA & ERP Architecture Suite",
    category: "SAP & ERP",
    rating: 4.88,
    studentsCount: 650,
    duration: "14 Weeks",
    modulesCount: 22,
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop",
  },
];

export const CoursesScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const { isDownloaded } = useOffline();
  const [courses, setCourses] = useState<Course[]>(STATIC_COURSES);
  const [selectedCat, setSelectedCat] = useState("All");
  const [search, setSearch] = useState("");
  const [wishlist, setWishlist] = useState<string[]>(["mern-stack"]);

  useEffect(() => {
    apiClient.get("/courses").then((res) => {
      if (res.data?.courses?.length) {
        setCourses(res.data.courses);
      }
    }).catch(() => {});
  }, []);

  const toggleWishlist = (id: string) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filtered = courses.filter((c) => {
    const matchesCat = selectedCat === "All" || c.category === selectedCat;
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#060811", "#0B0F19", "#0F1426"]} style={StyleSheet.absoluteFillObject} />

      <Header title="Explore Courses" subtitle="55+ Production-grade technical tracks" />

      {/* Search Input Bar */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Search size={18} color={Colors.textMuted} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search Java, AWS, MERN, AI, Cyber Security…"
            placeholderTextColor={Colors.textMuted}
            style={styles.searchInput}
          />
        </View>
      </View>

      {/* Category Pills */}
      <View style={styles.catContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={CATEGORIES}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.catList}
          renderItem={({ item }) => {
            const active = selectedCat === item;
            return (
              <TouchableOpacity
                onPress={() => setSelectedCat(item)}
                style={[styles.catPill, active && styles.catPillActive]}
              >
                <Text style={[styles.catText, active && styles.catTextActive]}>{item}</Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Courses List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.courseList}
        renderItem={({ item }) => {
          const isWish = wishlist.includes(item.id);
          const hasOffline = isDownloaded(item.id);

          return (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => navigation.navigate("CourseDetail", { courseId: item.id, title: item.title })}
            >
              <GlassCard style={styles.courseCard}>
                <View style={styles.thumbContainer}>
                  <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
                  
                  {item.isPopular && (
                    <View style={styles.popularBadge}>
                      <Text style={styles.popularText}>BESTSELLER</Text>
                    </View>
                  )}

                  <TouchableOpacity
                    onPress={() => toggleWishlist(item.id)}
                    style={styles.heartButton}
                  >
                    <Heart size={16} color={isWish ? Colors.error : "#FFFFFF"} fill={isWish ? Colors.error : "transparent"} />
                  </TouchableOpacity>

                  {hasOffline && (
                    <View style={styles.offlineBadge}>
                      <WifiOff size={11} color="#FFFFFF" />
                      <Text style={styles.offlineText}>Saved Offline</Text>
                    </View>
                  )}
                </View>

                <View style={styles.cardContent}>
                  <View style={styles.catRow}>
                    <Text style={styles.catLabel}>{item.category}</Text>
                    <View style={styles.ratingRow}>
                      <Star size={13} color="#FBBF24" fill="#FBBF24" />
                      <Text style={styles.ratingText}>{item.rating}</Text>
                      <Text style={styles.studentsCount}>({item.studentsCount})</Text>
                    </View>
                  </View>

                  <Text style={styles.itemTitle} numberOfLines={2}>{item.title}</Text>

                  <View style={styles.metaRow}>
                    <View style={styles.metaItem}>
                      <Clock size={13} color={Colors.textMuted} />
                      <Text style={styles.metaText}>{item.duration}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <BookOpen size={13} color={Colors.textMuted} />
                      <Text style={styles.metaText}>{item.modulesCount} Modules</Text>
                    </View>
                    <View style={styles.oneToOneBadge}>
                      <Text style={styles.oneToOneText}>One-on-One Live</Text>
                    </View>
                  </View>
                </View>
              </GlassCard>
            </TouchableOpacity>
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
  catContainer: { marginBottom: 12 },
  catList: { paddingHorizontal: 16, gap: 8 },
  catPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  catPillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  catText: { color: Colors.textSecondary, fontSize: 12, fontWeight: "600" },
  catTextActive: { color: "#FFFFFF", fontWeight: "700" },
  courseList: { paddingHorizontal: 16, paddingBottom: 110, gap: 14 },
  courseCard: { padding: 0, overflow: "hidden" },
  thumbContainer: { width: "100%", height: 160, position: "relative" },
  thumbnail: { width: "100%", height: "100%", resizeMode: "cover" },
  popularBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  popularText: { color: "#FFFFFF", fontSize: 9, fontWeight: "800", letterSpacing: 0.5 },
  heartButton: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  offlineBadge: {
    position: "absolute",
    bottom: 8,
    left: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(16, 185, 129, 0.85)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  offlineText: { color: "#FFFFFF", fontSize: 10, fontWeight: "700" },
  cardContent: { padding: 14, gap: 8 },
  catRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  catLabel: { color: Colors.textCyan, fontSize: 11, fontWeight: "700" },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  ratingText: { color: "#FFFFFF", fontSize: 12, fontWeight: "700" },
  studentsCount: { color: Colors.textMuted, fontSize: 11 },
  itemTitle: { color: "#FFFFFF", fontSize: 15, fontWeight: "800", lineHeight: 20 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 12, marginTop: 4 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { color: Colors.textMuted, fontSize: 11 },
  oneToOneBadge: {
    marginLeft: "auto",
    backgroundColor: "rgba(124, 58, 237, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(124, 58, 237, 0.3)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  oneToOneText: { color: Colors.textPurple, fontSize: 10, fontWeight: "700" },
});
