import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";

export default function OwnerWaitingScreen() {
//   const [timeLeft, setTimeLeft] = useState(60); // seconds (demo)

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setTimeLeft((prev) => {
//         if (prev <= 1) clearInterval(timer);
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timer);
//   }, []);

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: "https://cdn-icons-png.flaticon.com/512/1048/1048953.png",
        }}
        style={styles.image}
      />

      <Text style={styles.title}>Request Submitted ✅</Text>

     <Text style={styles.subtitle}>
  Your account is under review by admin.
</Text>

<Text style={styles.timer}>
  Please check back later or wait for approval.
</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
    marginBottom: 20,
  },
  timer: {
    fontSize: 18,
    color: "#7A3FC4",
  },
});