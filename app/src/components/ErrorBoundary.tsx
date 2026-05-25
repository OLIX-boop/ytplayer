import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing, typography } from '@/theme';

interface State {
  hasError: boolean;
  error: Error | null;
  info: React.ErrorInfo | null;
}

interface Props {
  children: React.ReactNode;
}

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false, error: null, info: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, info: null };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    this.setState({ info });
    // Log to console (visible via Safari Web Inspector if developer mode is on)
    console.error('[YTPlayer ErrorBoundary]', error, info.componentStack);
  }

  reset = () => this.setState({ hasError: false, error: null, info: null });

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <View style={styles.root}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.heading}>Ops — qualcosa è andato storto</Text>
          <Text style={styles.subheading}>L'app ha incontrato un errore durante l'avvio.</Text>

          <View style={styles.card}>
            <Text style={styles.label}>Errore</Text>
            <Text style={styles.errorText} selectable>
              {this.state.error?.name}: {this.state.error?.message}
            </Text>
          </View>

          {this.state.error?.stack && (
            <View style={styles.card}>
              <Text style={styles.label}>Stack</Text>
              <Text style={styles.stackText} selectable>
                {this.state.error.stack}
              </Text>
            </View>
          )}

          {this.state.info?.componentStack && (
            <View style={styles.card}>
              <Text style={styles.label}>Component stack</Text>
              <Text style={styles.stackText} selectable>
                {this.state.info.componentStack}
              </Text>
            </View>
          )}

          <Pressable style={styles.button} onPress={this.reset}>
            <Text style={styles.buttonText}>Riprova</Text>
          </Pressable>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, paddingTop: 60 },
  content: { padding: spacing.lg, gap: spacing.md },
  heading: { ...typography.title, color: colors.text },
  subheading: { ...typography.body, color: colors.textMuted, marginBottom: spacing.md },
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: radii.md,
    padding: spacing.md,
    gap: spacing.sm,
  },
  label: {
    ...typography.caption,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  errorText: { ...typography.body, color: colors.danger },
  stackText: { ...typography.caption, color: colors.text, fontFamily: 'Courier' },
  button: {
    backgroundColor: colors.accent,
    borderRadius: radii.pill,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  buttonText: { ...typography.body, color: colors.bg, fontWeight: '700' },
});
