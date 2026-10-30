import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { LiveSparkline } from '@/components/LiveSparkline';
import { TokenAvatar } from '@/components/TokenAvatar';
import { FIVE_MIN_MARKETS, FEATURED_MATCH } from '@/constants/mockData';

export function PredictScreen() {
  const c = Colors.phantom;

  // Real-time BTC countdown timer (matches 03:37 -> 03:36 in video)
  const [secondsLeft, setSecondsLeft] = useState(217); // 3m 37s
  const [btcPrice, setBtcPrice] = useState(80274.98);
  const targetPrice = 80254.96;
  const [userPrediction, setUserPrediction] = useState<'up' | 'down' | null>(null);
  const [chartPoints, setChartPoints] = useState([85, 76, 68, 59, 50, 44, 38, 30, 26, 33, 31]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 300));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Real-time BTC price jitter
  useEffect(() => {
    const priceTimer = setInterval(() => {
      setBtcPrice((prev) => {
        const delta = (Math.random() * 8 - 4.5);
        const nextPrice = Number((prev + delta).toFixed(2));
        setChartPoints((prevPoints) => {
          const last = prevPoints[prevPoints.length - 1];
          const nextPoint = Math.max(15, Math.min(95, last + (delta > 0 ? 3 : -3)));
          return [...prevPoints.slice(1), nextPoint];
        });
        return nextPrice;
      });
    }, 2500);

    return () => clearInterval(priceTimer);
  }, []);

  const formatCountdown = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}>
      {/* 1. Featured Match Card (Ligue 1) */}
      <View style={styles.featuredCard}>
        <View style={styles.featuredTopRow}>
          <Text style={styles.leagueText}>Ligue 1</Text>
          <Text style={styles.matchTimeText}>{FEATURED_MATCH.timeRemaining}</Text>
        </View>

        <View style={styles.teamsCol}>
          <View style={styles.teamItem}>
            <View style={[styles.teamBullet, { backgroundColor: '#3B82F6' }]} />
            <Text style={styles.teamName}>{FEATURED_MATCH.teamA}</Text>
          </View>
          <View style={styles.teamItem}>
            <View style={[styles.teamBullet, { backgroundColor: '#EAB308' }]} />
            <Text style={styles.teamName}>{FEATURED_MATCH.teamB}</Text>
          </View>
        </View>

        {/* Probability Split Bar */}
        <View style={styles.probabilityBarWrapper}>
          <View style={[styles.barSegment, { flex: 74, backgroundColor: '#3B82F6', borderTopLeftRadius: 6, borderBottomLeftRadius: 6 }]} />
          <View style={[styles.barSegment, { flex: 15, backgroundColor: '#334155' }]} />
          <View style={[styles.barSegment, { flex: 11, backgroundColor: '#EAB308', borderTopRightRadius: 6, borderBottomRightRadius: 6 }]} />
        </View>

        <View style={styles.probabilityLabels}>
          <Text style={styles.probLabelBlue}>74%</Text>
          <Text style={styles.probLabelYellow}>11%</Text>
        </View>
      </View>

      {/* 2. Upcoming Carousel */}
      <View style={styles.sectionHeaderSpacing}>
        <TouchableOpacity style={styles.sectionTitleRow} activeOpacity={0.7}>
          <Text style={styles.sectionTitle}>Upcoming</Text>
          <Ionicons name="chevron-forward" size={18} color="#8E8E9B" />
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.upcomingScroll}>
        <TouchableOpacity style={styles.upcomingCard} activeOpacity={0.8}>
          <View style={styles.upcomingHeader}>
            <Text style={{ fontSize: 18 }}>⚽</Text>
            <Text style={styles.upcomingTime}>in 2h</Text>
          </View>
          <Text style={styles.upcomingTeams} numberOfLines={2}>
            Paris Saint-Germain vs Lyon
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.upcomingCard} activeOpacity={0.8}>
          <View style={styles.upcomingHeader}>
            <Text style={{ fontSize: 18 }}>⚽</Text>
            <Text style={styles.upcomingTime}>in 2h</Text>
          </View>
          <Text style={styles.upcomingTeams} numberOfLines={2}>
            Sevilla vs Real Sociedad
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* 3. Up or Down Binary Prediction */}
      <View style={styles.sectionHeaderSpacing}>
        <TouchableOpacity style={styles.sectionTitleRow} activeOpacity={0.7}>
          <Text style={styles.sectionTitle}>Up or Down</Text>
          <Ionicons name="chevron-forward" size={18} color="#8E8E9B" />
        </TouchableOpacity>
      </View>

      <View style={styles.upDownCard}>
        {/* Top Header of Card */}
        <View style={styles.upDownTop}>
          <View style={styles.upDownTokenRow}>
            <View style={styles.btcIconCircle}>
              <FontAwesome5 name="bitcoin" size={18} color="#FFFFFF" />
            </View>
            <View>
              <Text style={styles.btcPriceText}>
                ${btcPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Text>
              <Text style={styles.btcTargetText}>
                Target ${targetPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </Text>
            </View>
          </View>

          {/* Countdown timer badge */}
          <View style={styles.countdownBadge}>
            <Text style={styles.countdownText}>{formatCountdown(secondsLeft)}</Text>
          </View>
        </View>

        {/* Live Sparkline Graph */}
        <View style={styles.chartWrapper}>
          <LiveSparkline points={chartPoints} width={310} height={90} color="#00D26A" />
        </View>

        {/* Binary Choice Buttons */}
        <View style={styles.choiceButtonsRow}>
          <TouchableOpacity
            style={[
              styles.choiceBtn,
              styles.choiceBtnUp,
              userPrediction === 'up' && styles.choiceBtnActiveUp,
            ]}
            onPress={() => setUserPrediction('up')}
            activeOpacity={0.8}>
            <Text style={styles.choiceBtnUpText}>▲ Up • 41%</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.choiceBtn,
              styles.choiceBtnDown,
              userPrediction === 'down' && styles.choiceBtnActiveDown,
            ]}
            onPress={() => setUserPrediction('down')}
            activeOpacity={0.8}>
            <Text style={styles.choiceBtnDownText}>▼ Down • 59%</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 4. 5-Minute Markets Grid */}
      <View style={styles.sectionHeaderSpacing}>
        <Text style={styles.sectionTitle}>5 Minute Markets</Text>
      </View>

      <View style={styles.fiveMinGrid}>
        {FIVE_MIN_MARKETS.map((market) => (
          <TouchableOpacity key={market.id} style={styles.fiveMinCard} activeOpacity={0.8}>
            <TokenAvatar symbol={market.symbol} size={32} />
            <View>
              <Text style={styles.fiveMinSymbol}>{market.symbol}</Text>
              <Text style={styles.fiveMinDuration}>{market.duration}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* 5. Soccer Section */}
      <View style={styles.sectionHeaderSpacing}>
        <TouchableOpacity style={styles.sectionTitleRow} activeOpacity={0.7}>
          <Text style={styles.sectionTitle}>Soccer</Text>
          <Ionicons name="chevron-forward" size={18} color="#8E8E9B" />
        </TouchableOpacity>
      </View>

      <View style={styles.soccerMatchRow}>
        <Text style={styles.soccerMatchTitle}>
          Paris Saint-Germain vs Lyon • In 1h 48m
        </Text>
        <View style={styles.soccerOddsRow}>
          <Text style={{ color: '#3B82F6', fontWeight: '700' }}>Paris 74%</Text>
          <Text style={{ color: '#8E8E9B' }}>•</Text>
          <Text style={{ color: '#EAB308', fontWeight: '700' }}>Lyon 11%</Text>
        </View>
      </View>

      <View style={{ height: 110 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.phantom.background,
  },
  contentContainer: {
    paddingTop: 8,
    paddingHorizontal: 16,
  },
  featuredCard: {
    backgroundColor: '#12121A',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#1F1F2C',
    gap: 14,
  },
  featuredTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leagueText: {
    color: '#8E8E9B',
    fontSize: 13,
    fontWeight: '600',
  },
  matchTimeText: {
    color: '#8E8E9B',
    fontSize: 13,
  },
  teamsCol: {
    gap: 8,
  },
  teamItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  teamBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  teamName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  probabilityBarWrapper: {
    flexDirection: 'row',
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    backgroundColor: '#1E1E2A',
  },
  barSegment: {
    height: '100%',
  },
  probabilityLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  probLabelBlue: {
    color: '#3B82F6',
    fontSize: 13,
    fontWeight: '700',
  },
  probLabelYellow: {
    color: '#EAB308',
    fontSize: 13,
    fontWeight: '700',
  },
  sectionHeaderSpacing: {
    marginTop: 20,
    marginBottom: 12,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  upcomingScroll: {
    gap: 12,
    paddingRight: 16,
  },
  upcomingCard: {
    width: 170,
    backgroundColor: '#13131C',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#20202E',
    gap: 10,
  },
  upcomingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  upcomingTime: {
    color: '#8E8E9B',
    fontSize: 12,
  },
  upcomingTeams: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
  },
  upDownCard: {
    backgroundColor: '#13131C',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#20202E',
    gap: 12,
  },
  upDownTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  upDownTokenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  btcIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F7931A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btcPriceText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  btcTargetText: {
    color: '#8E8E9B',
    fontSize: 12,
  },
  countdownBadge: {
    backgroundColor: '#1C1C28',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  countdownText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  chartWrapper: {
    alignItems: 'center',
    marginVertical: 4,
  },
  choiceButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  choiceBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  choiceBtnUp: {
    backgroundColor: 'rgba(0, 210, 106, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(0, 210, 106, 0.3)',
  },
  choiceBtnActiveUp: {
    backgroundColor: '#00D26A',
  },
  choiceBtnUpText: {
    color: '#00D26A',
    fontSize: 14,
    fontWeight: '700',
  },
  choiceBtnDown: {
    backgroundColor: 'rgba(255, 75, 85, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 75, 85, 0.3)',
  },
  choiceBtnActiveDown: {
    backgroundColor: '#FF4B55',
  },
  choiceBtnDownText: {
    color: '#FF4B55',
    fontSize: 14,
    fontWeight: '700',
  },
  fiveMinGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  fiveMinCard: {
    width: '48%',
    backgroundColor: '#13131C',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#20202E',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  fiveMinSymbol: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  fiveMinDuration: {
    color: '#8E8E9B',
    fontSize: 12,
  },
  soccerMatchRow: {
    backgroundColor: '#13131C',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#20202E',
    gap: 8,
  },
  soccerMatchTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  soccerOddsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    fontSize: 13,
  },
});
