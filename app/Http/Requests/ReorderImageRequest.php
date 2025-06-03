<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReorderImageRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('manage products');
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Ensure order values are integers
        if ($this->has('items')) {
            $items = collect($this->items)->map(function ($item) {
                if (isset($item['order'])) {
                    $item['order'] = (int) $item['order'];
                }
                return $item;
            })->toArray();

            $this->merge(['items' => $items]);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'items' => 'required|array|min:1',
            'items.*.id' => 'required|ulid|exists:images,id',
            'items.*.order' => 'required|integer|min:0',
        ];
    }

    /**
     * Get custom error messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'items.required' => 'Items array is required.',
            'items.array' => 'Items must be an array.',
            'items.min' => 'At least one item is required.',
            'items.*.id.required' => 'Each item must have an ID.',
            'items.*.id.ulid' => 'Each item ID must be a valid ULID.',
            'items.*.id.exists' => 'One or more images do not exist.',
            'items.*.order.required' => 'Each item must have an order value.',
            'items.*.order.integer' => 'Order values must be integers.',
            'items.*.order.min' => 'Order values cannot be negative.',
        ];
    }
}
