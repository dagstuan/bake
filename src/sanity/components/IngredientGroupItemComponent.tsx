import { Stack, Card } from "@sanity/ui";
import { ReactElement, ReactPortal } from "react";
import { ObjectItemProps, ObjectMember } from "sanity";

export const IngredientGroupItemComponent = (props: ObjectItemProps) => {
  if (
    !props.children ||
    typeof props.children === "string" ||
    typeof props.children === "number" ||
    typeof props.children === "boolean" ||
    !(typeof props.children === "object" && "props" in props.children)
  ) {
    return props.renderDefault(props);
  }

  const children = getChildrenPreview(props.children);

  return (
    <Stack>
      <Card>
        <Card style={{ marginBottom: "0" }}>{props.renderDefault(props)}</Card>
        {
          <Card paddingX={6} paddingBottom={5} borderBottom>
            {children}
          </Card>
        }
      </Card>
    </Stack>
  );
};

function getChildrenPreview(children: ReactElement | ReactPortal) {
  const contentMember = children?.props?.children?.props?.members?.find(
    (member: ObjectMember) => "name" in member && member.name === "ingredients",
  );

  if (!contentMember) {
    return children;
  }

  const members = contentMember
    ? [
        {
          ...contentMember,
          field: {
            ...contentMember.field,
            schemaType: {
              ...contentMember.field.schemaType,
              title: " ", // Empty string to hide original field title
            },
          },
        },
      ]
    : [];

  // Deep clone object so the regular modal view is unaffected
  // while showing only the "inner" modular content, and removing its "title" via empty string
  return {
    ...children,
    props: {
      ...children.props,
      children: {
        ...children.props.children,
        props: {
          ...children.props.children.props,
          members,
        },
      },
    },
  };
}
