
# Store

```dart
class FoodInfoStore extends ValueNotifier<FoodInfoState>{

  final FoodInfoService service;

  // Creating the Private Static Instance
  static FoodInfoStore? _instance;

  // Private Construtor
  FoodInfoStore._internal(this.service) : super(InitialFoodInfoState());

  // Factory builder to secure the Singleton
  factory FoodInfoStore(FoodInfoService service) {
    _instance ??= FoodInfoStore._internal(service);
    return _instance!;
  }
  
  Future findAllFoodInfos() async{
    value = LoadingFoodInfoState();
    try{
      var foods = await service.findAll();
      value = SucessFoodInfoState(foodInfos: foods);
    }catch(e){
      value = ErrorFoodInfoState(message: e.toString());      
    }
  }

  Future findFoodInfo() async{
    value = LoadingFoodInfoState();
    try{
      var food = await service.findById("food");
      value = SucessSingleFoodInfoState(foodInfo: food ??= const FoodInfoModel(calories: 10,carbs: 1, food: '', protein: 1, fat: 1, score: 1));
    }catch(e){
      value = ErrorFoodInfoState(message: e.toString());      
    }
  }

}
```

---

# State

```dart
import 'package:cal_ai/models/food_info_model.dart';

  

abstract class FoodInfoState {}

class InitialFoodInfoState extends FoodInfoState {}

class LoadingFoodInfoState extends FoodInfoState {}

class SucessFoodInfoState extends FoodInfoState {
  final List<FoodInfoModel> foodInfos;
  
  SucessFoodInfoState({required this.foodInfos});
}

class SucessSingleFoodInfoState extends FoodInfoState {
  final FoodInfoModel foodInfo;
  
  SucessSingleFoodInfoState({required this.foodInfo});
}

class ErrorFoodInfoState extends FoodInfoState {
  final String message;

  ErrorFoodInfoState({required this.message});
}

class SucessDeleteFoodInfoState extends FoodInfoState {
  final String message;
  
  SucessDeleteFoodInfoState({required this.message});
}
```

---

# Service

```dart
abstract class GenericService<T> {

  Future<List<T>> findAll();

  Future<T?> findById(String name) async {
    await Future.delayed(const Duration(seconds: 3));
    return null;
  }

  Future<T> save(T item) async {
    await Future.delayed(const Duration(seconds: 3));
    return item;
  }

  Future<T> update(T item) async {
    await Future.delayed(const Duration(seconds: 3));
    return item;
  }

  Future<T?> delete(T item) async {
    await Future.delayed(const Duration(seconds: 3));
    return item;
  }

}
```