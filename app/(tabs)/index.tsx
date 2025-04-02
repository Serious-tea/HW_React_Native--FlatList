import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useForm, Controller } from 'react-hook-form';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { TextInput, Button } from 'react-native';

interface Todo {
  id: number;
  todo: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  date: string;
}

type RootStackParamList = {
  TaskList: undefined;
  AddTask: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

interface TaskListScreenProps extends NativeStackScreenProps<RootStackParamList, 'TaskList'> {}

function TaskListScreen({ navigation }: TaskListScreenProps) {
  const [tasks, setTasks] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('https://dummyjson.com/todos')
      .then((response) => response.json())
      .then((data: { todos: Todo[] }) => {
        setTasks(data.todos);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Помилка при отриманні даних:', error);
        setLoading(false);
      });
  }, []);

  const toggleComplete = (id: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>ODOT List</Text>
      <Text style={styles.date}>4th March 2018</Text>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }: { item: Todo }) => (
          <TouchableOpacity onPress={() => toggleComplete(item.id)}>
            <View style={styles.taskItem}>
              <Text style={[styles.taskText, item.completed && styles.completedText]}>
                {item.todo} ({item.priority})
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddTask')}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

function AddTaskScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'AddTask'>) {
  const { control, handleSubmit, reset } = useForm<Todo>();

  const onSubmit = (data: Todo) => {
    console.log('Нове завдання:', data);
    reset();
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Додати завдання</Text>
      <Controller
        control={control}
        name="todo"
        render={({ field: { onChange, value } }) => (
          <TextInput style={styles.input} placeholder="Назва завдання" onChangeText={onChange} value={value} />
        )}
      />
      <Controller
        control={control}
        name="date"
        render={({ field: { onChange, value } }) => (
          <TextInput style={styles.input} placeholder="Дата" onChangeText={onChange} value={value} />
        )}
      />
      <Controller
        control={control}
        name="priority"
        render={({ field: { onChange, value } }) => (
          <TextInput style={styles.input} placeholder="Пріоритет (low/medium/high)" onChangeText={onChange} value={value} />
        )}
      />
      <Button title="Додати" onPress={handleSubmit(onSubmit)} />
    </View>
  );
}

export default function App() {
  return (

      <Stack.Navigator>
        <Stack.Screen name="TaskList" component={TaskListScreen} options={{ title: 'Завдання' }} />
        <Stack.Screen name="AddTask" component={AddTaskScreen} options={{ title: 'Додати завдання' }} />
      </Stack.Navigator>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  date: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  taskItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
  },
  taskText: {
    fontSize: 18,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: '50%',
    marginRight: -25,
    backgroundColor: '#007bff',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
});
