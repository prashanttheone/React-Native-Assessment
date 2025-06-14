import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  StyleSheet,
  Text, TextInput, TouchableOpacity,
  View
} from 'react-native';
import { Button, Menu, Provider, Snackbar } from 'react-native-paper';
import { getProducts, saveProducts } from '../utils/storage';
export default function AddProductScreen() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '' });
  const  [category,setCategory] = useState("")
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.Images,
      allowsEditing:false,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleAdd = async () => {
    if (!name || !price || !image) {
      return setSnackbar({ visible: true, message: 'All fields are required' });
    }

    setLoading(true);
    const products = await getProducts();

    if (products.some(p => p.name.toLowerCase() === name.toLowerCase())) {
      setLoading(false);
      return setSnackbar({ visible: true, message: 'Product already exists' });
    }

    const newProduct = {
      id: Date.now(),
      name,
      price,
      image,
      category: category || 'Uncategory',
    };

    const updated = [...products, newProduct];
    await saveProducts(updated);
    setLoading(false);
    router.replace('/home');
  };
const categories = ['Uncategory', 'Accessory', 'Electronic'];
const [menuVisible, setMenuVisible] = useState(false);
  return (
   
<SafeAreaView style={styles.safe}>

 <Provider>
      <View style={styles.container}>
        <Text style={styles.title}>Add New Product</Text>
  <View style={styles.dropdownWrapper}>
  <Menu
    visible={menuVisible}
    onDismiss={() => setMenuVisible(false)}
    anchor={
      <Button mode="outlined" onPress={() => setMenuVisible(true)}>
        {category || 'Choose Category'}
      </Button>
    }
  >
    {categories.map((cat, index) => (
      <Menu.Item
        key={index}
        onPress={() => {
          setCategory(cat);
          setMenuVisible(false);
        }}
        title={cat}
      />
    ))}
  </Menu>
</View>
        <TextInput
          placeholder="Product Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <TextInput
          placeholder="Price"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          style={styles.input}
        />

        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <Text style={{ color: '#555' }}>Pick an Image</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleAdd} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Add Product</Text>}
        </TouchableOpacity>

        <Snackbar
          visible={snackbar.visible}
          onDismiss={() => setSnackbar({ visible: false, message: '' })}
          duration={2000}
        >
          {snackbar.message}
        </Snackbar>
      </View>
      </Provider>
    </SafeAreaView>

  );
}


const styles = StyleSheet.create({
  safe: {
    marginVertical: 50,
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  dropdownWrapper: {
    marginBottom: 15,
    zIndex: 10, 
  },
  imagePicker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    height: 150,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
  },
});