
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const categories = ["Spirits", "Beer", "Wine", "Mixers", "Snacks", "Glassware", "Supplies"];
const units = ["bottles", "cases", "liters", "pieces", "boxes", "kegs"];

interface ItemFormFieldsProps {
  formData: {
    name: string;
    category: string;
    quantity: string;
    unit: string;
    minStock: string;
    purchasePrice: string;
    sellingPrice: string;
    supplier: string;
  };
  onInputChange: (field: string, value: string) => void;
  idPrefix: string;
}

export const ItemFormFields = ({ formData, onInputChange, idPrefix }: ItemFormFieldsProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-name`} className="text-blue-200">Item Name</Label>
          <Input
            id={`${idPrefix}-name`}
            value={formData.name}
            onChange={(e) => onInputChange("name", e.target.value)}
            className="bg-slate-700 border-slate-600 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-category`} className="text-blue-200">Category</Label>
          <Select value={formData.category} onValueChange={(value) => onInputChange("category", value)}>
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600">
              {categories.map(category => (
                <SelectItem key={category} value={category} className="text-white">
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-quantity`} className="text-blue-200">Current Quantity</Label>
          <Input
            id={`${idPrefix}-quantity`}
            type="number"
            value={formData.quantity}
            onChange={(e) => onInputChange("quantity", e.target.value)}
            className="bg-slate-700 border-slate-600 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-unit`} className="text-blue-200">Unit</Label>
          <Select value={formData.unit} onValueChange={(value) => onInputChange("unit", value)}>
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600">
              {units.map(unit => (
                <SelectItem key={unit} value={unit} className="text-white">
                  {unit}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-minStock`} className="text-blue-200">Minimum Stock Level</Label>
          <Input
            id={`${idPrefix}-minStock`}
            type="number"
            value={formData.minStock}
            onChange={(e) => onInputChange("minStock", e.target.value)}
            className="bg-slate-700 border-slate-600 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-purchasePrice`} className="text-blue-200">Purchase Price ($)</Label>
          <Input
            id={`${idPrefix}-purchasePrice`}
            type="number"
            step="0.01"
            value={formData.purchasePrice}
            onChange={(e) => onInputChange("purchasePrice", e.target.value)}
            className="bg-slate-700 border-slate-600 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-sellingPrice`} className="text-blue-200">Selling Price ($)</Label>
          <Input
            id={`${idPrefix}-sellingPrice`}
            type="number"
            step="0.01"
            value={formData.sellingPrice}
            onChange={(e) => onInputChange("sellingPrice", e.target.value)}
            className="bg-slate-700 border-slate-600 text-white"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-supplier`} className="text-blue-200">Supplier</Label>
        <Input
          id={`${idPrefix}-supplier`}
          value={formData.supplier}
          onChange={(e) => onInputChange("supplier", e.target.value)}
          className="bg-slate-700 border-slate-600 text-white"
        />
      </div>
    </>
  );
};
