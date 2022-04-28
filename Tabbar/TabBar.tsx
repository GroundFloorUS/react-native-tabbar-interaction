import * as React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Dimensions,
  View,
  Animated,
  Text,
  TextStyle,
} from "react-native";
import * as shape from "d3-shape";
import Svg, { Path, Mask, Rect, Defs } from "react-native-svg";
import StaticTabbar from "./StaticTabbar";

const AnimatedSvg = Animated.createAnimatedComponent(Svg);
let { width } = Dimensions.get("window");

const height = 49;
const scoopWidth = 38;
const scoopDepth = 26;

const getPath = (tabWidth: number, width: number) => {
  const left = shape
    .line<string>()
    .x((d) => d.x)
    .y((d) => d.y)([
    { x: 0, y: 0 },
    { x: width + tabWidth / 2, y: 0 },
  ]);
  const tab = shape
    .line<string>()
    .x((d) => d.x)
    .y((d) => d.y)
    .curve(shape.curveBasis)([
    { x: width + tabWidth / 2 - 100, y: 0 },
    { x: width + tabWidth / 2 - height + -30, y: 0 },
    { x: width + tabWidth / 2 - scoopWidth + 10, y: -6 },
    { x: width + tabWidth / 2 - scoopWidth + 15, y: scoopDepth },
    { x: width + tabWidth / 2 + scoopWidth - 15, y: scoopDepth },
    { x: width + tabWidth / 2 + scoopWidth - 10, y: -6 },
    { x: width + tabWidth / 2 + height - -30, y: 0 },
    { x: width + tabWidth / 2 + 100, y: 0 },
  ]);
  const right = shape
    .line<string>()
    .x((d) => d.x)
    .y((d) => d.y)([
    { x: width, y: 0 },
    { x: width * 2, y: 0 },
    { x: width * 2, y: height },
    { x: 0, y: height },
    { x: 0, y: 0 },
  ]);

  return ` ${tab} `;
};

export interface TabsType {
  name: string;
  activeIcon: JSX.Element;
  inactiveIcon: JSX.Element;
}

interface Props {
  tabs: Array<TabsType>;
  containerTopRightRadius?: number;
  tabBarBackground: string;
  tabBarContainerBackground: string;
  containerBottomSpace?: number;
  containerWidth?: number;
  containerTopLeftRadius?: number;
  containerBottomLeftRadius?: number;
  containerBottomRightRadius?: number;
  activeTabBackground?: string;
  labelStyle?: TextStyle;
  onTabChange?: (tab: TabsType) => void;
  defaultActiveTabIndex?: number;
  transitionSpeed?: number;
  activeIndex: number;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
}

export default class Tabbar extends React.PureComponent<Props> {
  value = new Animated.Value(0);

  render() {
    const {
      tabs,
      containerTopRightRadius,
      tabBarBackground,
      tabBarContainerBackground,
      containerBottomSpace,
      containerWidth,
      containerTopLeftRadius,
      containerBottomLeftRadius,
      containerBottomRightRadius,
      activeIndex,
      setActiveIndex,
    } = this.props;
    let customWidth = containerWidth ? containerWidth : width;
    const { value } = this;
    const translateX = value.interpolate({
      inputRange: [0, customWidth],
      outputRange: [-customWidth, 0],
    });
    const tabWidth: number | void | string =
      tabs.length > 0
        ? customWidth / tabs.length
        : console.error("please add tab data");
    let d;
    if (typeof tabWidth == "number") {
      d = getPath(tabWidth, customWidth);
    }

    let borderTopRightRadius = containerTopRightRadius
      ? containerTopRightRadius
      : 0;
    let borderTopLeftRadius = containerTopLeftRadius
      ? containerTopLeftRadius
      : 0;
    let borderBottomLeftRadius = containerBottomLeftRadius
      ? containerBottomLeftRadius
      : 0;
    let borderBottomRightRadius = containerBottomRightRadius
      ? containerBottomRightRadius
      : 0;
    if (tabs.length > 0) {
      return (
        <>
          {containerBottomSpace && (
            <View
              style={{
                position: "absolute",
                bottom: 0,
                height: containerBottomSpace,
                left: 0,
                right: 0,
                backgroundColor: tabBarContainerBackground,
              }}
            />
          )}
          <View
            style={{
              position: "absolute",
              bottom: 0,
              paddingBottom: containerBottomSpace ?? 0,
              alignSelf: "center",
              borderTopRightRadius,
              borderTopLeftRadius,
              borderBottomLeftRadius,
              borderBottomRightRadius,
            }}
          >
            <View
              {...{
                height,
                width: customWidth,
                alignSelf: "center",
                borderTopRightRadius,
                borderTopLeftRadius,
                borderBottomLeftRadius,
                borderBottomRightRadius,
              }}
            >
              <AnimatedSvg
                width={customWidth * 2}
                {...{ height }}
                style={{
                  transform: [{ translateX }],
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Defs>
                  <Mask id="cutout">
                    <Rect
                      fill={"white"}
                      x={0}
                      y={0}
                      width={customWidth * 2}
                      height={height}
                    />
                    <Path fill={"black"} {...{ d }} />
                  </Mask>
                </Defs>
                <Rect
                  mask="url(#cutout)"
                  fill={tabBarContainerBackground}
                  x={0}
                  y={0}
                  width={customWidth * 2}
                  height={height}
                />
              </AnimatedSvg>
              <View style={StyleSheet.absoluteFill}>
                <StaticTabbar {...this.props} {...{ tabs, value, height }} />
              </View>
            </View>
          </View>
        </>
      );
    } else {
      return (
        <View style={styles.emptyContainer}>
          <Text>Please add tab data</Text>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    width: width,
  },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
});
