import * as React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Menu, Provider, Text } from 'react-native-paper';

export default function Category({ onSelect }) {
  const [visible, setVisible] = React.useState(false);
  const [selected, setSelected] = React.useState('Uncategory');

  const handleSelect = (value) => {
    setSelected(value);
    setVisible(false);
    onSelect(value);
  };

  return (
    <Provider>
      <View style={styles.wrapper}>
        <Menu
          visible={visible}
          onDismiss={() => setVisible(false)}
          anchor={
            <TouchableOpacity style={styles.dropdown} onPress={() => setVisible(true)}>
              <Text style={styles.dropdownText}>{selected}</Text>
            </TouchableOpacity>
          }
          contentStyle={styles.menuStyle}
        >
          <Menu.Item
            onPress={() => handleSelect('Product')}
            title="Product"
            titleStyle={styles.menuItemText}
          />
          <Menu.Item
            onPress={() => handleSelect('Accessory')}
            title="Accessory"
            titleStyle={styles.menuItemText}
          />
          <Menu.Item
            onPress={() => handleSelect('Uncategory')}
            title="Uncategory"
            titleStyle={styles.menuItemText}
          />
        </Menu>
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 15,
    zIndex: 10,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#f5faff',
    elevation: 2,
  },
  dropdownText: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: '600',
  },
  menuStyle: {
    marginVertical: -50,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 15,
    width: '100%'
  },
  menuItemText: {
    fontSize: 15,
    color: '#333',
  },
});
