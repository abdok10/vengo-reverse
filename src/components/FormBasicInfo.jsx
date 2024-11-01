import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function FormBasicInfo({ 
  formName, 
  formDescription, 
  accountId, 
  setFormName, 
  setFormDescription, 
  setAccountId 
}) {
  return (
    <>
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <Label>Form Name</Label>
          <Input
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder="Enter form name"
            className="bg-white"
          />
        </div>
        <div>
          <Label>Form Description</Label>
          <Input
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
            placeholder="Enter form description"
            className="bg-white"
          />
        </div>
      </div>
      <div className="mb-4">
        <Label>Account ID (1-10)</Label>
        <Input
          type="number"
          min="1"
          max="10"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          className="w-32 bg-white"
        />
      </div>
    </>
  );
} 