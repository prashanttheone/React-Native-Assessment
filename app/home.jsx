import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Snackbar } from 'react-native-paper';

import {
    FlatList,
    Image,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { getProducts, saveProducts } from '../utils/storage';

export default function HomeScreen() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
   const [snackbar, setSnackbar] = useState({ visible: false, message: '' });

  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) router.replace('/login');
    };
    checkLogin();
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const data = await getProducts();
    setProducts(data);
    setFiltered(data);
  };
const handleDelete = async (id) => {
  const updated = products.filter((p) => p.id !== id);
  setProducts(updated);
  setFiltered(updated);
  await saveProducts(updated);
  setSnackbar({ visible: true, message: 'Item deleted successfully' });

};

  const handleSearch = (text) => {
    setSearchQuery(text);
    const filteredList = products.filter((p) =>
      p.name.toLowerCase().includes(text.toLowerCase())
    );
    setFiltered(filteredList);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    router.replace('/');
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <TouchableOpacity
        onPress={() => handleDelete(item.id)}
        style={styles.trashIcon}
      >
        <Ionicons name="trash" size={20} color="red" />
      </TouchableOpacity>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.price}>₹ {item.price}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            {/* Snackbar */}
      <Snackbar
        visible={snackbar.visible}
        onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
        duration={3000}
      >
        {snackbar.message}
      </Snackbar>
      <View style={styles.container}>
        <TouchableOpacity style={styles.logout} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#fff" />
        </TouchableOpacity>

        <TextInput
          placeholder="Search product..."
          value={searchQuery}
          onChangeText={handleSearch}
          style={styles.search}
        />

        {filtered.length === 0 ? (
          <Text style={styles.empty}>No Product Found</Text>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            numColumns={2}
            columnWrapperStyle={styles.row}
            showsVerticalScrollIndicator={false}
          />
        )}

        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push('/add-product')}
        >
          <Ionicons name="add" size={30} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    paddingTop: 50,
    flex: 10,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 15,
    paddingTop: 10,
  },
  logout: {
    alignSelf: 'flex-end',
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  search: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  empty: {
    textAlign: 'center',
    color: '#777',
    marginTop: 30,
    fontSize: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 5,
    borderWidth: 1,
    borderColor: '#eee',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 100,
    resizeMode: 'contain',
  },
  trashIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  name: {
    marginTop: 8,
    fontWeight: '600',
    fontSize: 14,
  },
  price: {
    color: '#555',
    marginTop: 4,
    fontSize: 13,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#007bff',
    borderRadius: 30,
    padding: 16,
    elevation: 5,
  },
});
