<?php

namespace Database\Factories;

use App\Models\Car;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Car>
 */
class CarFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $modelsByBrand = [
            'Toyota' => ['Corolla', 'Camry', 'RAV4', 'Yaris', 'Hilux'],
            'Honda' => ['Civic', 'Accord', 'CR-V', 'Jazz'],
            'Ford' => ['Focus', 'Fiesta', 'Mustang', 'Explorer'],
            'BMW' => ['3 Series', '5 Series', 'X3', 'X5'],
            'Mercedes-Benz' => ['A-Class', 'C-Class', 'E-Class', 'GLC'],
            'Audi' => ['A3', 'A4', 'Q5', 'Q7'],
            'Tesla' => ['Model 3', 'Model S', 'Model X', 'Model Y'],
            'Hyundai' => ['Elantra', 'Tucson', 'Santa Fe', 'i20'],
            'Kia' => ['Sportage', 'Sorento', 'Rio', 'Seltos'],
            'Volkswagen' => ['Golf', 'Passat', 'Tiguan', 'Polo'],
        ];

        $brand = $this->faker->randomKey($modelsByBrand);

        return [
            'brand' => $brand,
            'model' => $this->faker->randomElement($modelsByBrand[$brand]),
            'year' => $this->faker->numberBetween(2012, 2026),
            'price' => $this->faker->numberBetween(8000, 95000),
            'fuel_type' => $this->faker->randomElement(['Petrol', 'Diesel', 'Electric', 'Hybrid']),
            'mileage' => $this->faker->numberBetween(0, 150000),
        ];
    }
}
