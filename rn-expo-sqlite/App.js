import React, { useEffect, useState } from "react";
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("tasks.db"); // persistent db

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");

  // Initialize DB on first run
  useEffect(() => {
    db.execAsync(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL
      );
    `);
    loadTasks();
  }, []);

  // Load tasks from DB
  const loadTasks = async () => {
    const result = await db.getAllAsync("SELECT * FROM tasks ORDER BY id DESC");
    setTasks(result);
  };

  // Add a task
  const addTask = async () => {
    if (!input.trim()) return;
    await db.runAsync("INSERT INTO tasks (title) VALUES (?)", [input]);
    setInput("");
    loadTasks();
  };

  // Delete a task
  const deleteTask = async (id) => {
    await db.runAsync("DELETE FROM tasks WHERE id = ?", [id]);
    loadTasks();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📋 Task List (SQLite)</Text>

      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder="Enter task..."
          value={input}
          onChangeText={setInput}
        />
        <Button title="Add" onPress={addTask} />
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.taskRow}>
            <Text style={styles.taskText}>{item.title}</Text>
            <TouchableOpacity onPress={() => deleteTask(item.id)}>
              <Text style={styles.deleteBtn}>❌</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  row: { flexDirection: "row", marginBottom: 20 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginRight: 10,
    borderRadius: 6,
  },
  taskRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  taskText: { fontSize: 16 },
  deleteBtn: { fontSize: 18, color: "red" },
});