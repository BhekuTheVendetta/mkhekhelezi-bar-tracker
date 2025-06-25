
import { Navbar } from "@/components/Navbar";
import { InventoryForm } from "@/components/inventory/InventoryForm";

const AddItem = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <InventoryForm />
      </div>
    </div>
  );
};

export default AddItem;
