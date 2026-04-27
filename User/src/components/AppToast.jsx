import React, {
  createContext,
  useState,
  useContext,
  useRef,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ToastContext = createContext();
export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const insets = useSafeAreaInsets();

  const [message, setMessage] = useState("");
  const [type, setType] = useState("success");
  const [visible, setVisible] = useState(false);

  const translateY = useRef(new Animated.Value(100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef(null);

  const showToast = (msg, t = "success") => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    setMessage(msg);
    setType(t);
    setVisible(true);

    // reset
    translateY.setValue(100);
    opacity.setValue(0);

    // slide + fade in
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // hide
    timeoutRef.current = setTimeout(() => {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 100,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => setVisible(false));
    }, 2200);
  };


  const getGradient = () => {
    if (type === "error") return ["#FF5252", "#FF1744"];
    if (type === "info") return ["#2196F3", "#3A86FF"];
    return ["#2EC4B6", "#3A86FF"]; // your app theme
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {visible && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.wrapper,
            {
              bottom: 80 + insets.bottom,
              transform: [{ translateY }],
              opacity,
            },
          ]}
        >
          <LinearGradient
            colors={getGradient()}
            style={styles.toast}
          >

            <Text style={styles.text}>{message}</Text>
          </LinearGradient>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    alignSelf: "center",
    zIndex: 9999,
  },

  toast: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 30,
    elevation: 6,
  },

  text: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});