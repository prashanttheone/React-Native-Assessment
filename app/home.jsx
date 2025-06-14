import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Snackbar } from 'react-native-paper';
import { getProducts, saveProducts } from '../utils/storage';

export default function HomeScreen() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [category, setCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [snackbar, setSnackbar] = useState({ visible: false, message: '' });

  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) router.replace('/');
    };
    checkLogin();
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const data = await getProducts();
    setProducts(data);
    filterByCategory(data, category);
  };

  const handleDelete = async (id) => {
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    filterByCategory(updated, category);
    await saveProducts(updated);
    setSnackbar({ visible: true, message: 'Item deleted successfully' });
  };

  const filterByCategory = (list, selected) => {
    if (selected === 'All') {
      setFiltered(list);
    } else {
      setFiltered(list.filter((p) => p.category === selected));
    }
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

  const handleCategoryPress = (cat) => {
    setCategory(cat);
    filterByCategory(products, cat);
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

  const categories = ['All', 'Uncategory', 'Accessory', 'Electronic'];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Snackbar
        visible={snackbar.visible}
        onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
        duration={3000}
        style={styles.snackbar}
      >
        {snackbar.message}
      </Snackbar>

      <View style={styles.container}>
        <TouchableOpacity style={styles.logout} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="#fff" />
        </TouchableOpacity>

        <TextInput
          placeholder="Search product..."
          value={searchQuery}
          onChangeText={handleSearch}
          style={styles.search}
        />

        <View style={styles.categoryRow}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => handleCategoryPress(cat)}
              style={[
                styles.categoryButton,
                category === cat && styles.categoryButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.categoryText,
                  category === cat && styles.categoryTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

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
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop:50,
  },
  container: {
    flex: 1,
    padding: 15,
    paddingTop: 10,
  },
  logout: {
    alignSelf: 'flex-end',
    backgroundColor: '#007bff',
    padding: 8,
    borderRadius: 20,
    marginBottom: 10,
  },
  search: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#eee',
  },
  categoryButtonActive: {
    backgroundColor: '#007bff',
  },
  categoryText: {
    color: '#333',
    fontSize: 13,
  },
  categoryTextActive: {
    color: '#fff',
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
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#eee',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  trashIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  name: {
    marginTop: 8,
    fontWeight: '600',
    fontSize: 15,
  },
  price: {
    color: '#666',
    marginTop: 4,
    fontSize: 14,
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
  snackbar: {
    alignSelf: 'center',
    bottom: 20,
  },
});
