import { Stack, Card } from "@sanity/ui";
import { ReactElement, ReactPortal } from "react";
import { FieldMember, ObjectItemProps, ObjectMember } from "sanity";

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

const hasValidMembersProps = (
  props: unknown,
): props is { children: { props: { members: ObjectMember[] } } } => {
  return (
    !!props &&
    typeof props === "object" &&
    "children" in props &&
    typeof props.children === "object" &&
    !!props.children &&
    "props" in props.children &&
    typeof props.children.props === "object" &&
    !!props.children.props &&
    "members" in props.children.props &&
    Array.isArray(props.children.props.members)
  );
};

const isFieldMember = (member: ObjectMember): member is FieldMember => {
  return member.kind === "field";
};

function getChildrenPreview(children: ReactElement | ReactPortal) {
  if (!hasValidMembersProps(children.props)) {
    return null;
  }

  const contentMember = children.props.children.props.members.find(
    (member: ObjectMember) =>
      member.kind === "field" &&
      "name" in member &&
      member.name === "ingredients",
  );

  if (!contentMember || !isFieldMember(contentMember)) {
    return children;
  }

  const members = [
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
  ];

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
