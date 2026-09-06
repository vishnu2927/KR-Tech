import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { ALL_COURSES, CourseCard, Course } from "../components/Courses";
import { I } from "../components/Icons";
import SectionHeading from "../components/SectionHeading";

export default function CoursesPage({ onOpenDemoModal }: { onOpenDemoModal: (courseName?: string) => void }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "All";

  const [query, setQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [activeDetailsCourse, setActiveDetailsCourse] = useState<Course | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    const s = searchParams.get("search");
    if (s !== null) setQuery(s);
    const cat = searchParams.get("category");
    if (cat !== null) {
      // Map potential category param
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  const categories = [
    { label: "All", key: "All" },
    { label: "Cloud", key: "Cloud" },
    { label: "Cyber Security", key: "Cyber Security" },
    { label: "Networking", key: "Networking" },
    { label: "Microsoft", key: "Microsoft" },
    { label: "Data Analytics", key: "Data Analytics" },
    { label: "Project Management", key: "Project Management" },
    { label: "Salesforce", key: "Salesforce" },
    { label: "SAP", key: "SAP" },
    { label: "Java Backend", key: "Java Backend" },
    { label: "MERN Stack", key: "MERN Stack" },
    { label: "Python", key: "Python" },
    { label: "AI & ML", key: "AI & ML" },
    { label: "DSA", key: "DSA" },
  ];

  const levels = ["All", "Beginner", "Intermediate", "Advanced"];

  const filtered = ALL_COURSES.filter((course) => {
    // Category match
    let matchCat = false;
    if (selectedCategory === "All") {
      matchCat = true;
    } else if (selectedCategory === "Cloud" || selectedCategory === "Cloud Computing") {
      matchCat = course.categoryGroup === "Cloud Computing" || course.category.toLowerCase().includes("cloud") || course.category.toLowerCase().includes("aws") || course.category.toLowerCase().includes("azure") || course.category.toLowerCase().includes("gcp");
    } else if (selectedCategory === "Cyber Security") {
      matchCat = course.categoryGroup === "Cyber Security" || course.category.toLowerCase().includes("security") || course.category.toLowerCase().includes("cyber");
    } else if (selectedCategory === "Networking") {
      matchCat = course.categoryGroup === "Networking" || course.category.toLowerCase().includes("network") || course.category.toLowerCase().includes("cisco");
    } else if (selectedCategory === "Microsoft" || selectedCategory === "Microsoft & IT") {
      matchCat = course.categoryGroup === "Microsoft & IT" || course.category.toLowerCase().includes("microsoft") || course.title.toLowerCase().includes("windows") || course.title.toLowerCase().includes("active directory");
    } else if (selectedCategory === "Data Analytics" || selectedCategory === "Data & Analytics") {
      matchCat = course.categoryGroup === "Data & Analytics" || course.category === "Data Science" || course.category.toLowerCase().includes("analytics") || course.category.toLowerCase().includes("power bi") || course.category.toLowerCase().includes("tableau");
    } else if (selectedCategory === "Project Management" || selectedCategory === "Project Management & Agile") {
      matchCat = course.categoryGroup === "Project Management" || course.category.toLowerCase().includes("project") || course.category.toLowerCase().includes("agile") || course.category.toLowerCase().includes("pmp");
    } else if (selectedCategory === "Salesforce") {
      matchCat = course.category.toLowerCase().includes("salesforce") || course.title.toLowerCase().includes("salesforce");
    } else if (selectedCategory === "SAP") {
      matchCat = course.category.toLowerCase().includes("sap") || course.title.toLowerCase().includes("sap");
    } else if (selectedCategory === "Enterprise Technologies") {
      matchCat = course.categoryGroup === "Enterprise Technologies";
    } else {
      matchCat = course.category.toLowerCase() === selectedCategory.toLowerCase() || course.categoryGroup.toLowerCase() === selectedCategory.toLowerCase();
    }

    // Level match
    const matchLevel = selectedLevel === "All" || course.level === selectedLevel;

    // Search query match
    const q = query.trim().toLowerCase();
    const matchQuery =
      !q ||
      course.title.toLowerCase().includes(q) ||
      course.category.toLowerCase().includes(q) ||
      course.categoryGroup.toLowerCase().includes(q) ||
      course.mentor.toLowerCase().includes(q) ||
      course.mentorCompany.toLowerCase().includes(q) ||
      (course.badge && course.badge.toLowerCase().includes(q)) ||
      course.features.some((f) => f.toLowerCase().includes(q)) ||
      course.roadmap.some((r) => r.title.toLowerCase().includes(q) || r.topics.some((top) => top.toLowerCase().includes(q)));

    return matchCat && matchLevel && matchQuery;
  });

  const benefits = [
    {
      title: "One-on-One Mentorship",
      desc: "Learn with your dedicated 1:1 trainer who tailors each coding session to your speed, background, and goals.",
      icon: <I.Users />,
      color: "#7C3AED",
      bg: "#EDE9FE",
    },
    {
      title: "Flexible Timings",
      desc: "Schedule live classes at your convenient morning, evening, or weekend slots across global timezones.",
      icon: <I.Clock />,
      color: "#0891B2",
      bg: "#CFFAFE",
    },
    {
      title: "Dashboard Access",
      desc: "Instant access to your student portal with class recording archives, structured notes, and code submissions.",
      icon: <I.BarChart />,
      color: "#7C3AED",
      bg: "#EDE9FE",
    },
    {
      title: "Resume & Project Support",
      desc: "End-to-end guidance building enterprise capstones with ATS-friendly resume review and portfolio polish.",
      icon: <I.Award />,
      color: "#0891B2",
      bg: "#CFFAFE",
    },
  ];

  const courseFaqs = [
    {
      q: "Can I customize the course syllabus according to my specific requirements?",
      a: "Yes! Because all classes are 1-on-1 live, your mentor can adjust topics, focus extra hours on difficult concepts, or tailor assignments to your college/work project needs.",
    },
    {
      q: "What if I miss a live class due to an emergency or exam?",
      a: "No problem at all. You can easily reschedule your 1:1 session with your mentor in advance. Furthermore, all completed classes are automatically recorded and accessible 24/7 on your dashboard.",
    },
    {
      q: "Are the mentors available outside of live class hours for doubts?",
      a: "Yes! You have direct access to your dedicated mentor via the student portal chat channel for rapid doubt solving and code reviews between live sessions.",
    },
    {
      q: "Do I receive a certificate upon course completion?",
      a: "Yes. You receive a verified KR Tech Certificate of Completion containing a unique verification URL that you can showcase on LinkedIn and your resume.",
    },
    {
      q: "Is there any financial assistance or EMI option available?",
      a: "Yes, we offer zero-cost monthly EMI options starting at ₹1,200/month as well as merit-based fee concessions for students.",
    },
    {
      q: "How does the Free 1:1 Demo class work?",
      a: "You attend a private 45-minute live screen-sharing session with a senior mentor. We assess your goals, show you our interactive coding setup, and build a personalized study roadmap for you with zero upfront cost.",
    },
  ];

  return (
    <main style={{ paddingTop: 80, minHeight: "100vh", background: "#FDFDFE" }}>
      {/* ─────────────────────────────────────────────────────────────────────────────
          1. Hero Banner
      ───────────────────────────────────────────────────────────────────────────── */}
      <section
        style={{
          background: "linear-gradient(135deg,#0F0A1E 0%,#1B0E33 100%)",
          padding: "70px 0 80px",
          position: "relative",
          overflow: "hidden",
          textAlign: "center",
        }}
      >
        <div className="orb" style={{ width: 500, height: 500, top: -180, left: -100, background: "rgba(124,58,237,0.3)" }} />
        <div className="orb" style={{ width: 400, height: 400, bottom: -120, right: -60, background: "rgba(6,182,212,0.22)" }} />

        <div className="container-xl" style={{ position: "relative", zIndex: 1 }}>
          <span className="badge badge-dark" style={{ marginBottom: 18, display: "inline-block" }}>
            ⭐ 1:1 Live Coding Programs
          </span>

          <h1
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 900,
              fontSize: "clamp(2.2rem, 5vw, 3.8rem)",
              color: "white",
              lineHeight: 1.15,
              maxWidth: 900,
              margin: "0 auto 18px",
            }}
          >
            Explore Live Courses from <span className="gradient-text-warm">Industry Experts</span>
          </h1>

          <p
            style={{
              fontSize: "clamp(15px, 2vw, 18px)",
              color: "rgba(255,255,255,0.78)",
              maxWidth: 720,
              margin: "0 auto 36px",
              lineHeight: 1.75,
            }}
          >
            Choose personalized one-on-one training designed around your schedule and learning goals. Learn directly
            from mentors with 10+ years of real industry experience.
          </p>

          {/* Action CTAs */}
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 44 }}>
            <button
              onClick={() => onOpenDemoModal()}
              className="btn-primary"
              style={{ padding: "14px 34px", fontSize: 15, borderRadius: 16 }}
            >
              <I.Sparkles /> Book Free Demo
            </button>
            <Link
              to="/contact"
              className="btn-ghost-white"
              style={{ padding: "14px 30px", fontSize: 15, borderRadius: 16, textDecoration: "none" }}
            >
              <I.Users /> Talk to Mentor
            </Link>
          </div>

          {/* Floating Statistics Badges */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 12,
              flexWrap: "wrap",
              maxWidth: 960,
              margin: "0 auto",
            }}
          >
            {[
              { n: "20+ Live Courses", icon: <I.Code /> },
              { n: "10+ Expert Mentors", icon: <I.Award /> },
              { n: "1:1 Live Sessions", icon: <I.Users /> },
              { n: "Recorded Lectures Included", icon: <I.Play /> },
            ].map((s, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 18px",
                  borderRadius: 14,
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  backdropFilter: "blur(14px)",
                  color: "white",
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                <span style={{ color: "#67E8F9" }}>{s.icon}</span>
                {s.n}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          2. Sticky Search + Category Filter Bar
      ───────────────────────────────────────────────────────────────────────────── */}
      <section style={{ padding: "50px 0 30px" }}>
        <div className="container-xl">
          {/* Sticky search input */}
          <div
            style={{
              maxWidth: 640,
              margin: "0 auto 32px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 20px",
              borderRadius: 20,
              background: "white",
              border: "1.5px solid #DDD6FE",
              boxShadow: "0 10px 30px rgba(124,58,237,0.08)",
            }}
          >
            <I.Search />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Java, MERN, AI, Python, DSA, React..."
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                fontSize: 15,
                fontFamily: "Inter, sans-serif",
                color: "#1F2937",
              }}
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "#9CA3AF",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <I.Close />
              </button>
            )}
          </div>

          {/* Filter Chips Bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 16,
              marginBottom: 24,
              paddingBottom: 20,
              borderBottom: "1px solid #E5E7EB",
            }}
          >
            {/* Category Chips */}
            <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 6 }}>
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  style={{
                    padding: "8px 18px",
                    borderRadius: 99,
                    fontFamily: "Poppins, sans-serif",
                    fontSize: 13,
                    fontWeight: selectedCategory === cat.key ? 700 : 500,
                    cursor: "pointer",
                    border: selectedCategory === cat.key ? "1.5px solid #7C3AED" : "1.5px solid #E5E7EB",
                    background: selectedCategory === cat.key ? "#EDE9FE" : "white",
                    color: selectedCategory === cat.key ? "#7C3AED" : "#4B5563",
                    transition: "all 0.2s ease",
                    whiteSpace: "nowrap",
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Level Filter Dropdown */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#6B7280" }}>Level:</span>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                style={{
                  padding: "8px 14px",
                  borderRadius: 10,
                  border: "1.5px solid #E5E7EB",
                  fontSize: 13,
                  outline: "none",
                  fontFamily: "Inter, sans-serif",
                  background: "white",
                  color: "#374151",
                }}
              >
                {levels.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results count text */}
          <div style={{ marginBottom: 24, fontSize: 14, color: "#6B7280" }}>
            Showing <strong>{filtered.length}</strong> {filtered.length === 1 ? "course" : "courses"}
            {query && (
              <span>
                {" "}
                matching "<em>{query}</em>"
              </span>
            )}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          3. Featured Courses Grid
      ───────────────────────────────────────────────────────────────────────────── */}
      <section style={{ paddingBottom: "70px" }}>
        <div className="container-xl">
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onViewDetails={(c) => setActiveDetailsCourse(c)}
                  onBookDemo={(cName) => onOpenDemoModal(cName)}
                />
              ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                background: "white",
                borderRadius: 24,
                border: "1.5px dashed #DDD6FE",
              }}
            >
              <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
              <h3 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 18, color: "#0F0A1E" }}>
                No courses match your search criteria
              </h3>
              <p style={{ color: "#6B7280", fontSize: 14, marginTop: 6, marginBottom: 20 }}>
                Try searching for a different keyword or reset filters.
              </p>
              <button
                onClick={() => {
                  setQuery("");
                  setSelectedCategory("All");
                  setSelectedLevel("All");
                }}
                className="btn-primary"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          4. Learning Benefits Section (4 Gradient Cards)
      ───────────────────────────────────────────────────────────────────────────── */}
      <section className="bg-lavender" style={{ padding: "80px 0" }}>
        <div className="container-xl">
          <div style={{ marginBottom: 48 }}>
            <SectionHeading
              badge="Why KR Tech"
              badgeClass="badge-purple"
              title="Built for True Mastery:"
              accent="Learning Benefits"
              desc="Experience an education model engineered around your personalized success."
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: 22,
            }}
          >
            {benefits.map((b, i) => (
              <div
                key={i}
                className="card"
                style={{
                  padding: "28px",
                  background: "white",
                  borderRadius: 24,
                  border: "1.5px solid #EDE9FE",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: "0 4px 20px rgba(124,58,237,0.06)",
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 16,
                    background: b.bg,
                    color: b.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 18,
                  }}
                >
                  {b.icon}
                </div>
                <h3
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 700,
                    fontSize: 17,
                    color: "#0F0A1E",
                    marginBottom: 8,
                  }}
                >
                  {b.title}
                </h3>
                <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.65 }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          5. Course Roadmap / Syllabus Timeline
      ───────────────────────────────────────────────────────────────────────────── */}
      <section style={{ padding: "80px 0", background: "white" }}>
        <div className="container-xl">
          <div style={{ marginBottom: 50 }}>
            <SectionHeading
              badge="Course Roadmap"
              badgeClass="badge-cyan"
              title="Structured 4-Stage"
              accent="Course Roadmap"
              desc="Every course follows a hands-on progression with real milestones and portfolio capstones."
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 20,
            }}
          >
            {[
              {
                stage: "Stage 1 · Foundations",
                time: "Weeks 1-2",
                title: "Core Architecture & Concepts",
                desc: "Deep dive into language fundamentals, memory models, modern design patterns, and debugging setup.",
                badge: "Practical Exercises",
                color: "#7C3AED",
                bg: "#EDE9FE",
              },
              {
                stage: "Stage 2 · Backend & APIs",
                time: "Weeks 3-4",
                title: "Frameworks & Database Models",
                desc: "Build scalable REST APIs, relational/NoSQL schemas, authentication flows, and middleware.",
                badge: "Midterm Milestone",
                color: "#0891B2",
                bg: "#CFFAFE",
              },
              {
                stage: "Stage 3 · Scalability",
                time: "Weeks 5-6",
                title: "Microservices & Distributed Systems",
                desc: "Implement message queues (Kafka), Redis caching, Docker containerization, and cloud deployment.",
                badge: "Live Coding Challenge",
                color: "#7C3AED",
                bg: "#EDE9FE",
              },
              {
                stage: "Stage 4 · Production",
                time: "Weeks 7-8",
                title: "Capstone & Resume Polish",
                desc: "Complete end-to-end production application deployment, 1:1 code audit, and ATS resume overhaul.",
                badge: "Verified Certificate",
                color: "#10B981",
                bg: "#D1FAE5",
              },
            ].map((s, idx) => (
              <div
                key={idx}
                className="card"
                style={{
                  padding: "26px",
                  borderRadius: 24,
                  background: "white",
                  border: "1.5px solid #EDE9FE",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: s.color, background: s.bg, padding: "3px 10px", borderRadius: 99 }}>
                      {s.time}
                    </span>
                    <span style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 600 }}>{s.stage}</span>
                  </div>

                  <h3
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 700,
                      fontSize: 16,
                      color: "#0F0A1E",
                      marginBottom: 8,
                    }}
                  >
                    {s.title}
                  </h3>
                  <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.6, marginBottom: 16 }}>{s.desc}</p>
                </div>

                <div style={{ paddingTop: 14, borderTop: "1px solid #F3F4F6", display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: s.color }}>
                  <I.Check /> {s.badge}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          6. Large Free Demo Gradient Banner
      ───────────────────────────────────────────────────────────────────────────── */}
      <section style={{ padding: "0 0 80px" }}>
        <div className="container-xl">
          <div
            style={{
              background: "linear-gradient(135deg,#7C3AED 0%,#5B21B6 45%,#0891B2 100%)",
              borderRadius: 32,
              padding: "54px 36px",
              textAlign: "center",
              color: "white",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 24px 60px rgba(124,58,237,0.25)",
            }}
          >
            <div className="orb" style={{ width: 340, height: 340, top: -100, right: -40, background: "rgba(255,255,255,0.12)" }} />
            <span
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: 12,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                background: "rgba(255,255,255,0.2)",
                padding: "4px 12px",
                borderRadius: 99,
                display: "inline-block",
                marginBottom: 16,
              }}
            >
              Personalized Guidance
            </span>

            <h2
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 800,
                fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                lineHeight: 1.2,
                marginBottom: 14,
              }}
            >
              Not Sure Which Course to Choose?
            </h2>

            <p
              style={{
                fontSize: "clamp(14px, 1.8vw, 17px)",
                color: "rgba(255,255,255,0.85)",
                maxWidth: 600,
                margin: "0 auto 32px",
                lineHeight: 1.7,
              }}
            >
              Connect with an experienced academic mentor for a free 45-minute 1:1 evaluation session and custom
              roadmap recommendation.
            </p>

            <button
              onClick={() => onOpenDemoModal()}
              style={{
                padding: "14px 36px",
                borderRadius: 16,
                fontFamily: "Poppins, sans-serif",
                fontWeight: 700,
                fontSize: 15,
                background: "white",
                color: "#7C3AED",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <I.Sparkles /> Book Your Free Demo
            </button>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          7. Course-Specific FAQs
      ───────────────────────────────────────────────────────────────────────────── */}
      <section className="bg-lavender" style={{ padding: "80px 0" }}>
        <div className="container-xl">
          <div style={{ maxWidth: 740, margin: "0 auto" }}>
            <div style={{ marginBottom: 44 }}>
              <SectionHeading
                badge="Course FAQ"
                badgeClass="badge-purple"
                title="Courses & Enrollment"
                accent="Questions"
                desc="Everything you need to know about our live classes, roadmaps, and 1:1 mentoring."
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {courseFaqs.map((f, i) => (
                <div
                  key={i}
                  style={{
                    borderRadius: 20,
                    overflow: "hidden",
                    background: "white",
                    border: `1.5px solid ${openFaq === i ? "#C4B5FD" : "#F3F4F6"}`,
                    boxShadow: openFaq === i ? "0 4px 24px rgba(124,58,237,0.09)" : "none",
                    transition: "all 0.2s",
                  }}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{
                      width: "100%",
                      padding: "18px 22px",
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: 16,
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 600,
                        fontSize: 15,
                        color: "#0F0A1E",
                        lineHeight: 1.5,
                      }}
                    >
                      {f.q}
                    </span>
                    <span
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: "50%",
                        background: openFaq === i ? "#7C3AED" : "#F3F4F6",
                        color: openFaq === i ? "white" : "#6B7280",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        marginTop: 1,
                      }}
                    >
                      {openFaq === i ? <I.Minus /> : <I.Plus />}
                    </span>
                  </button>

                  {openFaq === i && (
                    <div
                      style={{
                        padding: "0 22px 20px",
                        fontSize: 14,
                        lineHeight: 1.75,
                        color: "#6B7280",
                        fontFamily: "Inter, sans-serif",
                      }}
                    >
                      {f.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          8. Course Details Modal (View Details)
      ───────────────────────────────────────────────────────────────────────────── */}
      {activeDetailsCourse && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(15,10,30,0.75)",
            backdropFilter: "blur(12px)",
            padding: 20,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveDetailsCourse(null);
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 680,
              background: "white",
              borderRadius: 24,
              overflow: "hidden",
              boxShadow: "0 25px 60px rgba(0,0,0,0.35)",
              animation: "scaleIn 0.25s ease-out",
              maxHeight: "85vh",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                padding: "22px 28px",
                background: "linear-gradient(135deg,#7C3AED 0%,#06B6D4 100%)",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, background: "rgba(255,255,255,0.2)", padding: "2px 8px", borderRadius: 99 }}>
                  1:1 Live Syllabus & Roadmap
                </span>
                <h3 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800, fontSize: 18, marginTop: 6, marginBottom: 2 }}>
                  {activeDetailsCourse.title}
                </h3>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.85)" }}>
                  Mentor: {activeDetailsCourse.mentor} ({activeDetailsCourse.mentorCompany}) · {activeDetailsCourse.duration}
                </div>
              </div>
              <button
                onClick={() => setActiveDetailsCourse(null)}
                style={{
                  background: "rgba(255,255,255,0.2)",
                  border: "none",
                  borderRadius: 10,
                  width: 34,
                  height: 34,
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <I.Close />
              </button>
            </div>

            <div style={{ padding: "24px 28px", overflowY: "auto", flex: 1 }}>
              <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 15, color: "#0F0A1E", marginBottom: 14 }}>
                Curriculum & Weekly Milestones:
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {activeDetailsCourse.roadmap.map((r, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: "#F9FAFB",
                      borderRadius: 16,
                      padding: "16px 18px",
                      border: "1px solid #F3F4F6",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 13, color: "#7C3AED" }}>
                        {r.week} — {r.title}
                      </span>
                    </div>
                    <ul style={{ paddingLeft: 18, margin: "6px 0 10px", fontSize: 12, color: "#4B5563" }}>
                      {r.topics.map((top, tIdx) => (
                        <li key={tIdx} style={{ marginBottom: 3 }}>{top}</li>
                      ))}
                    </ul>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#065F46", background: "#D1FAE5", padding: "4px 10px", borderRadius: 8, display: "inline-block" }}>
                      🎯 Milestone: {r.milestone}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ padding: "16px 28px", borderTop: "1px solid #F3F4F6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ fontSize: 11, color: "#9CA3AF" }}>Course Fee</span>
                <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800, fontSize: 18, color: "#7C3AED" }}>
                  {activeDetailsCourse.price}
                </div>
              </div>
              <button
                onClick={() => {
                  const courseName = activeDetailsCourse.title;
                  setActiveDetailsCourse(null);
                  onOpenDemoModal(courseName);
                }}
                className="btn-primary"
                style={{ padding: "10px 20px" }}
              >
                <I.Sparkles /> Book Free 1:1 Live Demo
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
