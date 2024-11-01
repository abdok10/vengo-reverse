import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

export default function GeneratedSchemaView({ schema }) {
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Generated Schema</CardTitle>
      </CardHeader>
      <CardContent>
        <pre className="bg-gray-700 text-white p-4 rounded-lg overflow-auto max-h-96">
          {JSON.stringify(schema, null, 2)}
        </pre>
      </CardContent>
    </Card>
  );
} 