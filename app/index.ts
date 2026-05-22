import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import TrackPlayer from 'react-native-track-player';

import App from './App';
import { PlaybackService } from '@/services/playbackService';

registerRootComponent(App);
TrackPlayer.registerPlaybackService(() => PlaybackService);
