import { Button } from "@/components/ui/button";
import PropTypes from "prop-types";

export default function FormHeader({ handleLogout }) {
  return (
    <div className="flex justify-end mb-4">
      <div className="text-3xl font-bold text-sky-700">Vengo Reverse</div>
      <Button variant="destructive" onClick={handleLogout} className="ml-auto">
        Logout
      </Button>
    </div>
  );
}

FormHeader.propTypes = {
  handleLogout: PropTypes.func.isRequired,
};
