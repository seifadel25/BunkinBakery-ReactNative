import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StripeProvider } from "@stripe/stripe-react-native";
import { useColorScheme } from "@/components/useColorScheme";
import CartProvider from "@/providers/CartProvider";
import AuthProvider from "@/providers/AuthProvider";
import QueryProvider from "@/providers/ClientProvider";
export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "index",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <StripeProvider
        publishableKey={
          process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
          "pk_test_51PARzJBmffrbeZXHP1E2KNRRiypcsunYY3Tw3uAiwgGq7c7UXy2RKnAYpiNf76jy4YSpSR7cvaOoCVWfptfExDIF00DKbU7UyB"
        }
        urlScheme="com.bunkinbakery.app"
        merchantIdentifier="merchant.com.bunkinbakery.app"
      >
        <AuthProvider>
          <QueryProvider>
            <CartProvider>
              <Stack>
                <Stack.Screen name="(user)" options={{ headerShown: false }} />
                <Stack.Screen name="(admin)" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen name="cart" options={{ presentation: "modal" }} />
              </Stack>
            </CartProvider>
          </QueryProvider>
        </AuthProvider>
      </StripeProvider>
    </ThemeProvider>
  );
}
