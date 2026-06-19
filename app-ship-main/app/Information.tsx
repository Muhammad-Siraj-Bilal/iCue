import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Bangers_400Regular } from '@expo-google-fonts/bangers';
import YoutubePlayer from 'react-native-youtube-iframe';
import GoldButton from '@/components/GoldButton';
import { CueTheme, cueShadow } from '@/constants/CueTheme';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { FIREBASE_DB, tryGetFirebaseAuth } from '@/FirebaseConfig';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

type LessonRecommendation = {
  focus: string;
  videoId: string;
  title: string;
  coach: string;
  reason: string;
};

type ShotData = {
  accelX?: number[];
  accelY?: number[];
  accelZ?: number[];
  gyroX?: number[];
  gyroY?: number[];
  gyroZ?: number[];
  quizAnswers?: Record<string, string | boolean>;
};

const questionMapping: Record<number, string> = {
  3: 'legalShot',
  1: 'ballPotted',
  2: 'foul',
  4: 'spin',
  5: 'doubleHit',
};

const fallbackLesson: LessonRecommendation = {
  focus: 'pro_reference',
  videoId: '7raN6I_KTus',
  title: 'Professional Shot Example',
  coach: 'Sharivari',
  reason: 'A clean professional reference for rhythm, timing, and the overall shape of a quality cue delivery.',
};

const calculateNormalizedScore = (shotData: ShotData): number => {
  const analyzeFluctuations = (data: number[] | undefined): number => {
    if (!data || data.length < 25) return 0;
    const preShot = data.slice(0, 16);
    const postShot = data.slice(24);
    const avgChange = (arr: number[]) =>
      arr.slice(1).reduce((sum, val, idx) => sum + Math.abs(val - arr[idx]), 0) / arr.length;
    return avgChange(preShot) + avgChange(postShot);
  };

  const fluctuationScore = [
    analyzeFluctuations(shotData.accelX),
    analyzeFluctuations(shotData.accelY),
    analyzeFluctuations(shotData.accelZ),
    analyzeFluctuations(shotData.gyroX),
    analyzeFluctuations(shotData.gyroY),
    analyzeFluctuations(shotData.gyroZ),
  ].reduce((sum, score) => sum + score, 0);

  const minScore = 10;
  const maxScore = 150;
  return Math.min(Math.max((fluctuationScore - minScore) / (maxScore - minScore), 0), 1);
};

const calculateSmoothnessScore = (shotData: ShotData | null): number => {
  if (!shotData) return 0;
  return Math.max(0, Math.min(100, Math.round(100 - calculateNormalizedScore(shotData) * 100)));
};

const parseQuizAnswers = (rawAnswers?: Record<string, string | boolean>) =>
  Object.fromEntries(
    Object.entries(rawAnswers || {}).map(([key, value]) => {
      const mappedKey = Number.isNaN(Number(key)) ? key : questionMapping[Number(key)];
      return [mappedKey, typeof value === 'boolean' ? value : String(value).toLowerCase() === 'yes'];
    })
  ) as Record<string, boolean>;

const getLessonRecommendation = (score: number, quiz: Record<string, boolean>): LessonRecommendation => {
  if (score < 60 || quiz.ballPotted === false) {
    return {
      focus: 'straight_stroke',
      videoId: '9bc0ujUhLtU',
      title: 'Long Straight Shot Reference',
      coach: 'Yukio Akagariyama',
      reason: 'Recommended when the stroke still looks unstable or the pot result is missing. It reinforces straight-line cueing and cleaner pocketing.',
    };
  }

  if (quiz.foul) {
    return {
      focus: 'cue_ball_control',
      videoId: 'lmDKt2jxY3w',
      title: 'Cue Ball Control And Shot Selection',
      coach: 'Max Eberle',
      reason: 'A strong fit when foul pressure or poor leave is showing up. It focuses on cue-ball discipline, route choice, and smarter position play.',
    };
  }

  if (score < 80) {
    return {
      focus: 'cue_ball_control',
      videoId: 'lmDKt2jxY3w',
      title: 'Cue Ball Control And Shot Selection',
      coach: 'Max Eberle',
      reason: 'Best for medium-level smoothness when the stroke is decent but still needs stronger cue-ball control and cleaner decision making.',
    };
  }

  return fallbackLesson;
};

const readParam = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

export default function InformationScreen() {
  const [fontsLoaded] = useFonts({
    Bangers_400Regular,
  });
  const params = useLocalSearchParams<{
    focus?: string | string[];
    videoId?: string | string[];
    title?: string | string[];
    coach?: string | string[];
    reason?: string | string[];
  }>();

  const accelXAnim = useRef(new Animated.Value(0.82)).current;
  const accelYAnim = useRef(new Animated.Value(0)).current;
  const accelZAnim = useRef(new Animated.Value(0)).current;
  const gyroXAnim = useRef(new Animated.Value(0)).current;
  const gyroYAnim = useRef(new Animated.Value(0)).current;
  const gyroZAnim = useRef(new Animated.Value(0)).current;

  const [recommendedLesson, setRecommendedLesson] = useState<LessonRecommendation>(fallbackLesson);
  const [loadingRecommendation, setLoadingRecommendation] = useState(true);
  const [showVideo, setShowVideo] = useState(false);

  const paramVideoId = readParam(params.videoId);
  const paramTitle = readParam(params.title);
  const paramCoach = readParam(params.coach);
  const paramReason = readParam(params.reason);
  const paramFocus = readParam(params.focus);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(accelXAnim, { toValue: 1, duration: 1100, useNativeDriver: true }),
        Animated.timing(accelXAnim, { toValue: 0.82, duration: 1500, useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(accelYAnim, { toValue: 18, duration: 900, useNativeDriver: true }),
        Animated.timing(accelYAnim, { toValue: -18, duration: 1600, useNativeDriver: true }),
        Animated.timing(accelYAnim, { toValue: 0, duration: 900, useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(accelZAnim, { toValue: 16, duration: 900, useNativeDriver: true }),
        Animated.timing(accelZAnim, { toValue: -16, duration: 1600, useNativeDriver: true }),
        Animated.timing(accelZAnim, { toValue: 0, duration: 900, useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(gyroXAnim, { toValue: 32, duration: 900, useNativeDriver: true }),
        Animated.timing(gyroXAnim, { toValue: -32, duration: 1500, useNativeDriver: true }),
        Animated.timing(gyroXAnim, { toValue: 0, duration: 900, useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(gyroYAnim, { toValue: 32, duration: 900, useNativeDriver: true }),
        Animated.timing(gyroYAnim, { toValue: -32, duration: 1500, useNativeDriver: true }),
        Animated.timing(gyroYAnim, { toValue: 0, duration: 900, useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(gyroZAnim, { toValue: 28, duration: 900, useNativeDriver: true }),
        Animated.timing(gyroZAnim, { toValue: -28, duration: 1500, useNativeDriver: true }),
        Animated.timing(gyroZAnim, { toValue: 0, duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, [accelXAnim, accelYAnim, accelZAnim, gyroXAnim, gyroYAnim, gyroZAnim]);

  useEffect(() => {
    if (paramVideoId && paramTitle && paramCoach && paramReason) {
      setRecommendedLesson({
        focus: paramFocus || 'custom',
        videoId: paramVideoId,
        title: paramTitle,
        coach: paramCoach,
        reason: paramReason,
      });
      setLoadingRecommendation(false);
      return;
    }

    const fetchLatestShotRecommendation = async () => {
      try {
        const auth = tryGetFirebaseAuth();
        const user = auth?.currentUser;
        if (!user) {
          setRecommendedLesson(fallbackLesson);
          return;
        }

        const shotsCollection = collection(FIREBASE_DB, `users/${user.uid}/shots`);
        const q = query(shotsCollection, orderBy('timestamp', 'desc'), limit(1));
        const docSnap = await getDocs(q);

        if (docSnap.empty) {
          setRecommendedLesson(fallbackLesson);
          return;
        }

        const latestShot = docSnap.docs[0].data() as ShotData;
        const score = calculateSmoothnessScore(latestShot);
        const quiz = parseQuizAnswers(latestShot.quizAnswers);
        setRecommendedLesson(getLessonRecommendation(score, quiz));
      } catch (error) {
        console.error('Error choosing lesson recommendation:', error);
        setRecommendedLesson(fallbackLesson);
      } finally {
        setLoadingRecommendation(false);
      }
    };

    fetchLatestShotRecommendation();
  }, [paramCoach, paramFocus, paramReason, paramTitle, paramVideoId]);

  const sensorCards = useMemo(
    () => [
      {
        title: 'Accel X',
        subtitle: 'Side-to-side path',
        description: 'Tracks unwanted sideways drift in the cue path. Large movement here can point to steering or a loose delivery line.',
        visualType: 'accel',
        style: { transform: [{ scale: accelXAnim }] },
      },
      {
        title: 'Accel Y',
        subtitle: 'Forward and backward drive',
        description: 'Shows how the cue accelerates through the shot. Useful for reading tempo, timing, and whether the stroke commits cleanly.',
        visualType: 'accel',
        style: { transform: [{ translateX: accelYAnim }] },
      },
      {
        title: 'Accel Z',
        subtitle: 'Vertical stability',
        description: 'Captures lift or dip during the stroke. Strong up-down movement can suggest unwanted body movement or cue elevation changes.',
        visualType: 'accel',
        style: { transform: [{ translateY: accelZAnim }] },
      },
      {
        title: 'Gyro X',
        subtitle: 'Pitch rotation',
        description: 'Measures forward-backward tilt in the cue action. This can reveal instability through contact or overactive wrist involvement.',
        visualType: 'gyro',
        style: {
          transform: [
            {
              rotateY: gyroXAnim.interpolate({
                inputRange: [-45, 45],
                outputRange: ['-45deg', '45deg'],
              }),
            },
          ],
        },
      },
      {
        title: 'Gyro Y',
        subtitle: 'Yaw rotation',
        description: 'Shows side-angle turning around the cue line. Too much yaw often means alignment drift or a cueing path that is not truly straight.',
        visualType: 'gyro',
        style: {
          transform: [
            {
              rotateX: gyroYAnim.interpolate({
                inputRange: [-45, 45],
                outputRange: ['-45deg', '45deg'],
              }),
            },
          ],
        },
      },
      {
        title: 'Gyro Z',
        subtitle: 'Roll rotation',
        description: 'Tracks twist in the cue during delivery. Helpful when diagnosing grip tension, roll, or unwanted cue turning at impact.',
        visualType: 'gyro',
        style: {
          transform: [
            {
              rotateZ: gyroZAnim.interpolate({
                inputRange: [-45, 45],
                outputRange: ['-45deg', '45deg'],
              }),
            },
          ],
        },
      },
    ],
    [accelXAnim, accelYAnim, accelZAnim, gyroXAnim, gyroYAnim, gyroZAnim]
  );

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading lesson room...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} indicatorStyle="black">
      <StatusBar style="light" />

      <LinearGradient
        colors={[CueTheme.colors.feltDeep, CueTheme.colors.feltDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroCard}
      >
        <Text style={styles.heroEyebrow}>Learning Room</Text>
        <Text style={styles.heroTitle}>Understand The Signals.{'\n'}Train The Fix.</Text>
        <Text style={styles.heroSubtitle}>
          Read what each accelerometer and gyroscope channel means, then jump straight into the most useful pro lesson for the latest shot pattern.
        </Text>
      </LinearGradient>

      <View style={styles.recommendationCard}>
        <View style={styles.recommendationHeader}>
          <View style={styles.recommendationHeaderText}>
            <Text style={styles.recommendationTitle}>Recommended Video Lesson</Text>
            <Text style={styles.recommendationHint}>
              {loadingRecommendation ? 'Reading the latest shot profile...' : `Focus area: ${recommendedLesson.coach}`}
            </Text>
          </View>
          <View style={styles.recommendationBadge}>
            <Text style={styles.recommendationBadgeText}>YouTube</Text>
          </View>
        </View>
        <Text style={styles.lessonTitle}>{recommendedLesson.title}</Text>
        <Text style={styles.lessonReason}>{recommendedLesson.reason}</Text>

        {showVideo ? (
          <View style={styles.videoShell}>
            <YoutubePlayer
              height={220}
              play={false}
              videoId={recommendedLesson.videoId}
            />
          </View>
        ) : null}

        <View style={styles.recommendationActions}>
          <GoldButton onPress={() => setShowVideo((value) => !value)} width={width * 0.78} style={styles.actionButton}>
            {showVideo ? 'Hide Lesson Video' : 'Play Recommended Video'}
          </GoldButton>
          <GoldButton
            onPress={() => Linking.openURL(`https://www.youtube.com/watch?v=${recommendedLesson.videoId}`)}
            width={width * 0.78}
            style={styles.secondaryButton}
          >
            Open In YouTube
          </GoldButton>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>What The Motion Channels Mean</Text>
        <Text style={styles.sectionHint}>
          These sensor streams explain where the stroke is drifting, lifting, twisting, or becoming unstable through contact.
        </Text>
      </View>

      {sensorCards.map((card) => (
        <View key={card.title} style={styles.sensorCard}>
          <View style={styles.sensorHeader}>
            <View style={styles.sensorBadge}>
              <Text style={styles.sensorBadgeText}>{card.title}</Text>
            </View>
            <Text style={styles.sensorSubtitle}>{card.subtitle}</Text>
          </View>
          {card.visualType === 'accel' ? (
            <View style={styles.cueStage}>
              <Animated.View style={[styles.cueMotionWrap, card.style]}>
                <Image
                  source={require('@/assets/images/cuestick.jpg')}
                  style={styles.cueStick}
                />
              </Animated.View>
            </View>
          ) : (
            <View style={styles.gyroStage}>
              <Animated.Image
                source={require('@/assets/images/cuestick.jpg')}
                style={[styles.gyroCueStick, card.style]}
              />
            </View>
          )}
          <Text style={styles.sensorDescription}>{card.description}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CueTheme.colors.felt,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: CueTheme.colors.felt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: CueTheme.colors.chalk,
    fontSize: 16,
  },
  heroCard: {
    borderRadius: 30,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(215, 181, 109, 0.22)',
    marginBottom: 18,
    ...cueShadow,
  },
  heroEyebrow: {
    color: CueTheme.colors.brass,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.6,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  heroTitle: {
    fontSize: 38,
    lineHeight: 40,
    fontFamily: 'Bangers_400Regular',
    color: CueTheme.colors.chalk,
    letterSpacing: 2.2,
    marginBottom: 14,
  },
  heroSubtitle: {
    color: '#E4EFEA',
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 320,
  },
  recommendationCard: {
    backgroundColor: CueTheme.colors.card,
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: CueTheme.colors.line,
    ...cueShadow,
  },
  recommendationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 10,
  },
  recommendationHeaderText: {
    flex: 1,
  },
  recommendationTitle: {
    color: CueTheme.colors.rail,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  recommendationHint: {
    color: CueTheme.colors.slateSoft,
    fontSize: 13,
    lineHeight: 18,
  },
  recommendationBadge: {
    backgroundColor: 'rgba(215, 181, 109, 0.14)',
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(215, 181, 109, 0.22)',
  },
  recommendationBadgeText: {
    color: CueTheme.colors.rail,
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  lessonTitle: {
    color: CueTheme.colors.rail,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
  },
  lessonReason: {
    color: CueTheme.colors.slateSoft,
    fontSize: 15,
    lineHeight: 22,
  },
  videoShell: {
    marginTop: 16,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: CueTheme.colors.line,
  },
  recommendationActions: {
    alignItems: 'center',
    marginTop: 18,
  },
  actionButton: {
    marginBottom: 10,
  },
  secondaryButton: {
    marginBottom: 4,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    color: CueTheme.colors.chalk,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 6,
  },
  sectionHint: {
    color: CueTheme.colors.mist,
    fontSize: 13,
    lineHeight: 18,
    maxWidth: 330,
  },
  sensorCard: {
    backgroundColor: CueTheme.colors.cardAlt,
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: CueTheme.colors.line,
    ...cueShadow,
  },
  sensorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 16,
  },
  sensorBadge: {
    backgroundColor: CueTheme.colors.brass,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  sensorBadgeText: {
    color: CueTheme.colors.rail,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.7,
    textTransform: 'uppercase',
  },
  sensorSubtitle: {
    color: CueTheme.colors.slateSoft,
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
    textAlign: 'right',
  },
  cueStage: {
    backgroundColor: '#FFFDF8',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(17, 53, 44, 0.08)',
    paddingVertical: 20,
    paddingHorizontal: 12,
    marginBottom: 18,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  cueMotionWrap: {
    width: 320,
    height: 78,
    alignItems: 'center',
    justifyContent: 'center',
    backfaceVisibility: 'hidden',
  },
  cueStick: {
    width: 260,
    height: 62,
    resizeMode: 'contain',
  },
  gyroStage: {
    paddingVertical: 30,
    marginBottom: 18,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  gyroCueStick: {
    width: 300,
    height: 50,
    resizeMode: 'contain',
  },
  sensorDescription: {
    color: CueTheme.colors.slate,
    fontSize: 15,
    lineHeight: 22,
  },
});
