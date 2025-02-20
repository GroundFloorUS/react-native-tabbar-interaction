import * as React from "react";
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  Text,
  TextStyle,
} from "react-native";

import { TabsType } from "./TabBar";
let { width } = Dimensions.get("window");
var prevIndex = 0;

interface Props {
  value?: Animated.AnimatedValue;
  tabs: Array<TabsType>;
  onTabChange?: (tab: TabsType) => void;
  labelStyle?: TextStyle;
  activeTabBackground?: string;
  Hvalue?: number;
  containerWidth?: number;
  defaultActiveTabIndex?: number;
  transitionSpeed?: number;
  activeIndex: number;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
  height: number;
}

export default class StaticTabbar extends React.PureComponent<Props> {
  values: Array<Animated.AnimatedValue>;
  transitionDuration = this.props.transitionSpeed
    ? this.props.transitionSpeed
    : null;

  constructor(props: Props) {
    super(props);
    const { tabs, activeIndex, setActiveIndex } = this.props;

    this.values = tabs?.map(
      (tab, index) => new Animated.Value(index === activeIndex ? 1 : 0)
    );
  }

  componentDidMount() {
    this.onPress(this.props.activeIndex, true);
  }

  componentDidUpdate() {
    this.onPress(this.props.activeIndex, false);
  }

  onPress = (index: number, noAnimation: boolean = false) => {
    if (prevIndex !== index) {
      const { value, tabs, containerWidth } = this.props;
      const { transitionDuration } = this;
      let customWidth = containerWidth ? containerWidth : width;
      const tabWidth = customWidth / tabs.length;
      Animated.sequence([
        Animated.parallel(
          this.values.map(
            (v: Animated.AnimatedValue | Animated.AnimatedValueXY) =>
              Animated.timing(v, {
                toValue: 0,
                useNativeDriver: true,
                duration: noAnimation ? 0 : 50,
              })
          )
        ),
        Animated.timing(value, {
          toValue: tabWidth * index,
          useNativeDriver: true,
          duration: noAnimation ? 0 : transitionDuration,
        }),
        Animated.timing(this.values[index], {
          toValue: 1,
          useNativeDriver: true,
          duration: 750,
        }),
      ]).start();
      prevIndex = index;
      this.props.setActiveIndex(index);
    }
  };

  render() {
    const { onPress } = this;
    const {
      tabs,
      value,
      activeTabBackground,
      labelStyle,
      onTabChange,
      containerWidth,
    } = this.props;
    let customWidth = containerWidth ? containerWidth : width;
    let mergeLabelStyle = { ...styles.labelStyle, ...labelStyle };
    let newActiveIcon = [
      styles.activeIcon,
      { backgroundColor: activeTabBackground ? activeTabBackground : "#fff" },
    ];
    const translateX = value.interpolate({
      inputRange: [0, customWidth],
      outputRange: [0, customWidth],
    });
    const tabWidth = customWidth / tabs.length;
    const buttonOffset = -14;
    return (
      <View style={styles.container}>
        <Animated.View
          style={{
            transform: [{ translateX }],
            position: "absolute",
            top: buttonOffset,
            left: 0,
            width: tabWidth,
            height: this.props.height,
            justifyContent: "center",
            alignItems: "center",

            zIndex: 50,
          }}
        >
          <View style={newActiveIcon} />
        </Animated.View>
        {tabs.map((tab, key) => {
          const cursor = tabWidth * key;
          const opacity = value.interpolate({
            inputRange: [cursor - tabWidth, cursor, cursor + tabWidth],
            outputRange: [1, 0, 1],
            extrapolate: "clamp",
          });

          const opacity1 = this.values[key].interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
            extrapolate: "clamp",
          });
          return (
            <React.Fragment {...{ key }}>
              <TouchableWithoutFeedback
                onPress={() => {
                  onPress(key);
                  onTabChange && onTabChange(tab);
                }}
              >
                <View style={[styles.tab, { width: tabWidth }]}>
                  <Animated.View style={[{ opacity, zIndex: 100 }]}>
                    {tab.inactiveIcon}
                  </Animated.View>
                  <Text style={[styles.labelStyle, labelStyle]}>
                    {tab.name}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
              <Animated.View
                style={[
                  {
                    transform: [{ translateX }],
                    position: "absolute",
                    top: buttonOffset,
                    left: 0,
                    width: tabWidth,
                    height: this.props.height,
                    justifyContent: "center",
                    alignItems: "center",

                    zIndex: 50,
                  },
                ]}
              >
                <View style={styles.activeIcon}>
                  <Animated.View style={[{ opacity: opacity1 }]}>
                    {tab.activeIcon}
                  </Animated.View>
                </View>
              </Animated.View>
            </React.Fragment>
          );
        })}
        <View
          style={{
            position: "absolute",
            left: tabWidth * 2,
            top: 8,
            bottom: 4,
            width: 1,
            backgroundColor: labelStyle?.backgroundColor ?? "#FFFFFF66",
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  tab: {
    height: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 6,
  },
  activeIcon: {
    width: 44,
    height: 44,
    borderRadius: 50,
    marginBottom: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  labelStyle: {
    fontSize: 11,
    marginBottom: 6,
    color: "#000",
  },
});
