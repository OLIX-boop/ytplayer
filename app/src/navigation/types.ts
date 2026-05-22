import type { NavigatorScreenParams } from '@react-navigation/native';

export type MainTabParamList = {
  Search: undefined;
  Queue: undefined;
  Library: undefined;
};

export type RootStackParamList = {
  Main: NavigatorScreenParams<MainTabParamList> | undefined;
  Player: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
