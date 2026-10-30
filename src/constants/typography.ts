import { Platform, TextStyle, StyleSheet } from 'react-native';

/**
 * Phantom Typography System
 * Replicates Phantom's mobile typography hierarchy using official Inter 18pt/24pt builds.
 *
 * Font Selection Note:
 * Phantom natively uses a bespoke, proprietary variant of Dinamo's 'ABC Favorit' (with custom numerals).
 * ABC Favorit is proprietary commercial software. Inter (Rasmus Andersson, SIL Open Font License)
 * is the closest open-source geometric neo-grotesque match, mirroring the high x-height, neutral apertures,
 * circular '0', balanced '8', curved terminal '9', and flat footed '2'.
 */

export const TypographyFonts = {
  black: 'Inter-Black',
  bold: 'Inter-Bold',
  semiBold: 'Inter-SemiBold',
  medium: 'Inter-Medium',
  regular: 'Inter-Regular',
} as const;

export type PhantomTypographyVariant =
  | 'portfolioBalance'
  | 'deltaAmount'
  | 'deltaPill'
  | 'accountSelector'
  | 'actionButton'
  | 'cashTitle'
  | 'cashAmount'
  | 'sectionHeading'
  | 'tokenName'
  | 'tokenSub'
  | 'tokenPrice'
  | 'navTabActive'
  | 'navTabInactive'
  | 'sheetTitle'
  | 'sheetOptionTitle'
  | 'sheetOptionSubtitle'
  | 'bodyRegular'
  | 'bodyMedium'
  | 'caption';

export const Typography = StyleSheet.create({
  // 1. Large Portfolio Balance ($929.88)
  portfolioBalance: {
    fontFamily: TypographyFonts.bold,
    fontSize: 38,
    lineHeight: 44,
    letterSpacing: -0.6,
    color: '#FFFFFF',
    fontWeight: Platform.OS === 'ios' ? '700' : undefined,
  },

  // 2. Daily Delta (-$6.11)
  deltaAmount: {
    fontFamily: TypographyFonts.medium,
    fontSize: 14.5,
    lineHeight: 18,
    letterSpacing: -0.2,
    fontWeight: Platform.OS === 'ios' ? '500' : undefined,
  },

  // 3. Percentage Badge Capsule ([-0.65%])
  deltaPill: {
    fontFamily: TypographyFonts.bold,
    fontSize: 12.5,
    lineHeight: 16,
    letterSpacing: -0.1,
    fontWeight: Platform.OS === 'ios' ? '700' : undefined,
  },

  // 4. Account Selector (Account 1 v)
  accountSelector: {
    fontFamily: TypographyFonts.semiBold,
    fontSize: 15,
    lineHeight: 18,
    letterSpacing: -0.2,
    color: '#8E8E93',
    fontWeight: Platform.OS === 'ios' ? '600' : undefined,
  },

  // 5. Main Action Buttons ([ Send ], [ + Deposit ])
  actionButton: {
    fontFamily: TypographyFonts.semiBold,
    fontSize: 15.5,
    lineHeight: 20,
    letterSpacing: -0.2,
    color: '#E2E2EA',
    fontWeight: Platform.OS === 'ios' ? '600' : undefined,
  },

  // 6. Cash Row Card Title ("Cash")
  cashTitle: {
    fontFamily: TypographyFonts.semiBold,
    fontSize: 15.5,
    lineHeight: 20,
    letterSpacing: -0.2,
    color: '#FFFFFF',
    fontWeight: Platform.OS === 'ios' ? '600' : undefined,
  },

  // 7. Cash Row Card Amount ("$0.00")
  cashAmount: {
    fontFamily: TypographyFonts.regular,
    fontSize: 15.5,
    lineHeight: 20,
    letterSpacing: -0.1,
    color: '#FFFFFF',
    fontWeight: Platform.OS === 'ios' ? '400' : undefined,
  },

  // 8. Section Headings ("Tokens >", "Perpetuals")
  sectionHeading: {
    fontFamily: TypographyFonts.bold,
    fontSize: 20,
    lineHeight: 24,
    letterSpacing: -0.3,
    color: '#FFFFFF',
    fontWeight: Platform.OS === 'ios' ? '700' : undefined,
  },

  // 9. Token List Name ("Solana")
  tokenName: {
    fontFamily: TypographyFonts.semiBold,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: -0.2,
    color: '#FFFFFF',
    fontWeight: Platform.OS === 'ios' ? '600' : undefined,
  },

  // 10. Token Quantity / Subtitle ("4.23 SOL", "$100.76")
  tokenSub: {
    fontFamily: TypographyFonts.regular,
    fontSize: 13,
    lineHeight: 17,
    letterSpacing: -0.1,
    color: '#8E8E93',
    fontWeight: Platform.OS === 'ios' ? '400' : undefined,
  },

  // 11. Token Price ("$426.22")
  tokenPrice: {
    fontFamily: TypographyFonts.semiBold,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: -0.2,
    color: '#FFFFFF',
    fontWeight: Platform.OS === 'ios' ? '600' : undefined,
  },

  // 12. Top Navigation Tabs - Active ("Home")
  navTabActive: {
    fontFamily: TypographyFonts.bold,
    fontSize: 15,
    lineHeight: 18,
    letterSpacing: -0.2,
    color: '#0D0C1D',
    fontWeight: Platform.OS === 'ios' ? '700' : undefined,
  },

  // 13. Top Navigation Tabs - Inactive ("Trade", "Predict")
  navTabInactive: {
    fontFamily: TypographyFonts.semiBold,
    fontSize: 15,
    lineHeight: 18,
    letterSpacing: -0.2,
    color: '#9E9EA8',
    fontWeight: Platform.OS === 'ios' ? '600' : undefined,
  },

  // 14. Bottom Sheet Header ("Deposit")
  sheetTitle: {
    fontFamily: TypographyFonts.semiBold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.2,
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // 15. Bottom Sheet Option Item Title ("Add Cash", "Buy Crypto", "Receive Crypto")
  sheetOptionTitle: {
    fontFamily: TypographyFonts.semiBold,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: -0.2,
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // 16. Bottom Sheet Option Subtitle ("With Google Pay, debit, or credit card")
  sheetOptionSubtitle: {
    fontFamily: TypographyFonts.regular,
    fontSize: 13,
    lineHeight: 17,
    letterSpacing: -0.1,
    color: '#8E8E98',
    fontWeight: '400',
  },

  // 17. Body Regular
  bodyRegular: {
    fontFamily: TypographyFonts.regular,
    fontSize: 14,
    lineHeight: 19,
    letterSpacing: -0.1,
    color: '#8E8E93',
    fontWeight: '400',
  },

  // 18. Body Medium
  bodyMedium: {
    fontFamily: TypographyFonts.medium,
    fontSize: 14,
    lineHeight: 19,
    letterSpacing: -0.1,
    color: '#FFFFFF',
    fontWeight: '500',
  },

  // 19. Small Caption / Timestamp
  caption: {
    fontFamily: TypographyFonts.regular,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: -0.1,
    color: '#8E8E93',
    fontWeight: '400',
  },
});

