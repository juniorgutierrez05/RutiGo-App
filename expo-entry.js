import './src/utils/nativeSafetyShim';
import './src/services/backgroundUpdateService';
import { registerRootComponent } from 'expo';
import App from './src/App.native';

registerRootComponent(App);
