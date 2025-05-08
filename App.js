import { StatusBar } from 'expo-status-bar';
import { useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import LottieView from 'lottie-react-native';

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const animationRef = useRef(null);
  const [isAnimationPlaying, setIsAnimationPlaying] = useState(false);
  const [typedText, setTypedText] = useState('');
  const typedTextRef = useRef('');
  const intervalRef = useRef(null);

  const handleSubmit = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    console.log('[POST] Sending prompt:', prompt);
    try {
      const res = await fetch('http://192.168.200.49:3001/api/lampu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      console.log('[RESPONSE]', data);
      setIsAnimationPlaying(true);

      const resultText = data.responseAI || 'No response';
      typeText(resultText);
    } catch (err) {
      console.error('Error:', err);
      setResponse('Terjadi kesalahan.');
    } finally {
      setLoading(false);
      setPrompt('');
    }
  };

  const typeText = (text) => {
    clearInterval(intervalRef.current);
    setTypedText('');
    typedTextRef.current = '';

    let index = 0;

    intervalRef.current = setInterval(() => {
      if (index < text.length) {
        setIsAnimationPlaying(true);
        const nextChar = text.charAt(index);
        typedTextRef.current += nextChar;
        
        setTypedText(typedTextRef.current);
        console.log('Typing:', nextChar);
        
        index++;
      } else {
        clearInterval(intervalRef.current);
        setIsAnimationPlaying(false);
      }
    }, 50);
  };

  return (
    <View style={styles.container}>
      <View style={styles.responseContainer}>
        <Text style={styles.label}>Assistant:</Text>
        <Text style={styles.responseText}>
          {loading ? 'Memproses...' : typedText || 'Belum ada respons'}
        </Text>

        <LottieView
          ref={animationRef}
          source={require('./assets/wave.json')} // Letakkan file di folder assets
          autoPlay
          loop
          speed={isAnimationPlaying ? 1 : .1}
          style={{
            width: 150,
            height: 150,
            opacity: isAnimationPlaying ? 1 : 0.5,
          }}
        />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={20}
        style={styles.inputContainer}
      >
        <TextInput
          style={styles.input}
          placeholder="Masukkan perintah..."
          value={prompt}
          onChangeText={setPrompt}
        />
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Kirim</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  responseContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    color: '#555',
    marginBottom: 8,
  },
  responseText: {
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
    color: '#222',
  },
  inputContainer: {
    paddingBottom: 40,
  },
  input: {
    height: 50,
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFF',
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
