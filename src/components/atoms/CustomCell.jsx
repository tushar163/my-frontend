"use client";

import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";

export function CustomCell({
  data,
  columnKey,
  actions,
}) {
  if (columnKey !== "actions") return data[columnKey];

  return (
    <div className="flex items-center gap-1">
      {actions?.map((action) => (
        <Button
          key={action.key}
          isIconOnly
          size="sm"
          variant={action.variant || "tertiary"}
          onPress={() => action.onPress(data)}
        >
          <Icon className="size-4" icon={action.icon} />
        </Button>
      ))}
    </div>
  );
}
