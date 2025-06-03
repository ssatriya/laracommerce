<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleAndPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            'view dashboard',
            'manage products',
            'manage categories',
            'manage orders',
            'manage payments',
            'buy product',
            'view own orders'
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        $admin = Role::firstOrCreate(['name' => 'admin']);
        $user = Role::firstOrCreate(['name' => 'user']);

        $admin->givePermissionTo([
            'view dashboard',
            'manage products',
            'manage categories',
            'manage orders',
            'manage payments',
        ]);

        $user->givePermissionTo([
            'buy product',
            'view own orders'
        ]);
    }
}
