declare module "react-native-snap-carousel" {
  import * as React from "react";
  import { FlatListProps, ViewStyle } from "react-native";

  export interface CarouselProps<T> extends FlatListProps<T> {
    data: T[];
    renderItem: ({ item, index }: { item: T; index: number }) => React.ReactNode;
    sliderWidth: number;
    itemWidth: number;
    inactiveSlideScale?: number;
    inactiveSlideOpacity?: number;
    loop?: boolean;
    onSnapToItem?: (index: number) => void;
    containerCustomStyle?: ViewStyle;
    contentContainerCustomStyle?: ViewStyle;
  }

  export default class Carousel<T> extends React.Component<CarouselProps<T>> {}

  export interface PaginationProps {
    dotsLength: number;
    activeDotIndex: number;
    containerStyle?: ViewStyle;
    dotStyle?: ViewStyle;
    inactiveDotOpacity?: number;
    inactiveDotScale?: number;
  }

  export class Pagination extends React.Component<PaginationProps> {}
}
