import { StyleSheet, Text, View } from 'react-native';

type Props = { title: string };

export default function PlaceholderScreen({title}: Props) {
  return (
	<View style={styles.container}>
		<Text>{title}</Text>
	</View>
  )
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
});

