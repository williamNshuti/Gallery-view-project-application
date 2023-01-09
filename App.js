import * as React from "react";
import { useState, useEffect, useRef } from "react";
import {
  StatusBar,
  FlatList,
  Image,
  Animated,
  Text,
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Easing,
  SafeAreaViewBase,
  SafeAreaView,
} from "react-native";
const { width, height } = Dimensions.get("screen");

const API_KEY = "563492ad6f917000010000012a76270f1f004c638fff5b82612e3b0e";
const API_URL =
  "https://api.pexels.com/v1/search?query=nature&orientation=portrait&size=small&per_page=20";

const IMAGE_SIZE = 80;
const SPACING = 10;
const fetchImageFromPexels = async () => {
  const data = await fetch(API_URL, {
    headers: {
      Authorization: API_KEY,
    },
  });

  const { photos } = await data.json();
  return photos;
};

export default function App() {
  const [images, setImages] = useState(null);
  useEffect(() => {
    const fetchImages = async () => {
      const result = await fetchImageFromPexels();
      setImages(result);
    };
    fetchImages();
  }, []);

  const topRef = useRef();
  const downRef = useRef();
  const [activeIndex, setactiveIndex] = useState(0);
  const scrollToActiveIndex = (index) => {
    setactiveIndex(index);
    topRef?.current?.scrollToOffset({
      offset: index * width,
      Animated: true,
    });
    if (index * (IMAGE_SIZE + SPACING) - IMAGE_SIZE / 2 > width / 2) {
      downRef?.current?.scrollToOffset({
        offset: index * (IMAGE_SIZE + SPACING) - width / 2 + IMAGE_SIZE / 2,
        Animated: true,
      });
    } else {
      downRef?.current?.scrollToOffset({
        offset: 0,
        Animated: true,
      });
    }
  };
  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <FlatList
        data={images}
        ref={topRef}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(ev) => {
          scrollToActiveIndex(
            Math.floor(ev.nativeEvent.contentOffset.x / width)
          );
        }}
        renderItem={({ item, index }) => {
          return (
            <View
              style={{
                width,
                height,
              }}
            >
              <Image
                source={{ uri: item.src.portrait }}
                style={[StyleSheet.absoluteFillObject]}
              />
            </View>
          );
        }}
      />

      <FlatList
        data={images}
        ref={downRef}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={{
          position: "absolute",
          bottom: IMAGE_SIZE,
        }}
        contentContainerStyle={{ paddingHorizontal: SPACING }}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity onPress={() => scrollToActiveIndex(index)}>
              <Image
                source={{ uri: item.src.portrait }}
                style={{
                  width: IMAGE_SIZE,
                  height: IMAGE_SIZE,
                  borderRadius: 12,
                  marginRight: SPACING,
                  borderWidth: 2,
                  borderColor: activeIndex === index ? "#fff" : "transparent",
                }}
              />
            </TouchableOpacity>
          );
        }}
      />
      <StatusBar hidden />
    </View>
  );
}
