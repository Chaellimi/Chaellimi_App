import React, { useEffect, useRef, useState } from 'react';
import { WebView } from 'react-native-webview';
import {
	StyleSheet,
	StatusBar,
	View,
	KeyboardAvoidingView,
	Platform,
	Keyboard,
} from 'react-native';
import Constants from 'expo-constants';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function App(): React.ReactElement {
	const statusBarHeight: number = Constants.statusBarHeight;
	const webViewRef = useRef<WebView>(null);
	const [isAuthPage, setIsAuthPage] = useState(false);

	const handleWebViewLoad = () => {
		webViewRef.current?.postMessage(statusBarHeight.toString());
	};

	const handleNavigationStateChange = (navState: any) => {
		const currentUrl = navState.url;
		setIsAuthPage(currentUrl.includes('/'));
	};

	useEffect(() => {
		if (webViewRef.current) {
			webViewRef.current.postMessage(statusBarHeight.toString());
		}
	}, [statusBarHeight]);

	useEffect(() => {
		const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
			webViewRef.current?.postMessage(
				JSON.stringify({ type: 'SCROLL_BOTTOM' })
			);
		});

		return () => {
			showSubscription.remove();
		};
	}, []);

	return (
		<SafeAreaProvider>
			<StatusBar
				backgroundColor={isAuthPage ? 'transparent' : 'white'}
				barStyle='dark-content'
				translucent={isAuthPage}
			/>
			<SafeAreaView
				style={styles.safeArea}
				edges={['top', 'right', 'bottom', 'left']}
			>
				<View
					style={[
						styles.container,
						{ marginTop: isAuthPage ? 0 : Constants.statusBarHeight },
					]}
				>
					<KeyboardAvoidingView
						behavior={Platform.OS === 'ios' ? 'padding' : undefined}
						keyboardVerticalOffset={0}
						style={{ flex: 1 }}
					>
						<WebView
							style={styles.webView}
							// source={{ uri: 'http://localhost:3000/' }}
							// source={{ uri: 'http://10.150.151.173:3000' }}
							source={{ uri: 'https://chaellimi.jamkris.kro.kr/' }}
							ref={webViewRef}
							bounces={false}
							scrollEnabled={false}
							onLoad={handleWebViewLoad}
							onNavigationStateChange={handleNavigationStateChange}
							onMessage={(event) => {
								console.log('Message from WebView:', event.nativeEvent.data);
							}}
						/>
					</KeyboardAvoidingView>
				</View>
			</SafeAreaView>
		</SafeAreaProvider>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: 'white',
	},
	container: {
		flex: 1,
	},
	webView: {
		flex: 1,
	},
});
