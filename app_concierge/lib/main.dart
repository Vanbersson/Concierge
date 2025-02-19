import 'package:app_concierge/features/domain/vehicle/vehicle_provider.dart';
import 'package:app_concierge/features/presentation/pages/splash_page.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => VehicleProvider()),
      ],
      child: MaterialApp(
        debugShowCheckedModeBanner: false,
        title: 'App Flutter portaria',
        theme: ThemeData(
          colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
          useMaterial3: true,
        ),
        home:const SplashPage(),
      ),
    );
  }
}
