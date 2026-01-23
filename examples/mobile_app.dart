// Ritam Generated Flutter/Dart Code
// Cross-platform: iOS, Android, Web, macOS, Windows, Linux

import 'package:flutter/material.dart';

void main() {
  runApp(const RitamApp());
}

/// The main Ritam application widget
class RitamApp extends StatelessWidget {
  const RitamApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Ritam Flutter App',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: Colors.deepPurple,
          brightness: Brightness.light,
        ),
        useMaterial3: true,
      ),
      darkTheme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: Colors.deepPurple,
          brightness: Brightness.dark,
        ),
        useMaterial3: true,
      ),
      themeMode: ThemeMode.system,
      home: const MainView(),
    );
  }
}


/// Ritam Component: MainView
class MainView extends StatefulWidget {
  const MainView({super.key});

  @override
  State<MainView> createState() => _MainViewState();
}

class _MainViewState extends State<MainView> {
  int _count = 0;
  String _title = "Ritam Counter";

  int get count => _count;
  String get title => _title;

  set count(int value) {
    setState(() { _count = value; });
  }
  set title(String value) {
    setState(() { _title = value; });
  }

  dynamic increment() {
    count = (count + 1);
  }
  dynamic decrement() {
    if ((count > 0)) {
    count = (count - 1);
  }
  }
  dynamic reset() {
    count = 0;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Ritam App'), centerTitle: true),
      body: SafeArea(
        child: Center(
          child: Container(child: Container(
              child: Column(
                children: [
                  Text(title, style: Theme.of(context).textTheme.headlineMedium),
                  Text(("Count: " + count)),
                  Container(
              child: Column(
                children: [
                  ElevatedButton(
              onPressed: () => decrement(),
              child: Text("-"),
            ),
                  ElevatedButton(
              onPressed: () => increment(),
              child: Text("+"),
            ),
                ],
              ),
            ),
                  ElevatedButton(
              onPressed: () => reset(),
              child: Text("Reset"),
            ),
                ],
              ),
            )),
        ),
      ),
    );
  }
}

std.print("✅ Ritam Flutter Counter App Ready!");
