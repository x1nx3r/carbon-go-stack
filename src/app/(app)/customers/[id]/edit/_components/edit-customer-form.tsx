"use client";

import {
  Button,
  ButtonSet,
  Form,
  FormGroup,
  InlineLoading,
  InlineNotification,
  Stack,
  TextInput,
} from "@carbon/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import type { Customer } from "@/gen/erp/customers/v1/customers_pb";
import { customersClient } from "@/lib/connect";
import styles from "@/components/form.module.scss";

export function EditCustomerForm() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const customer = useQuery({
    queryKey: ["customer", id],
    queryFn: () => customersClient.getCustomer({ id }),
    enabled: Boolean(id),
  });

  if (!id) {
    return (
      <InlineNotification
        kind="error"
        title="Missing customer"
        subtitle="The route has no customer id."
      />
    );
  }

  if (customer.isPending) {
    return <InlineLoading description="Loading customer…" />;
  }

  if (customer.isError) {
    return (
      <InlineNotification
        kind="error"
        title="Could not load the customer"
        subtitle={customer.error.message}
      />
    );
  }

  const found = customer.data.customer;
  if (!found) {
    return (
      <InlineNotification
        kind="error"
        title="Customer not found"
        subtitle="The record no longer exists."
      />
    );
  }

  return <EditForm customer={found} />;
}

function EditForm({ customer }: { customer: Customer }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [name, setName] = useState(customer.name);
  const [email, setEmail] = useState(customer.email);
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");

  const update = useMutation({
    mutationFn: () =>
      customersClient.updateCustomer({
        id: customer.id,
        name: name.trim(),
        email: email.trim(),
        currency: customer.currency,
      }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["customers"] }),
        queryClient.invalidateQueries({ queryKey: ["customer", customer.id] }),
      ]);
      router.push("/customers");
      router.refresh();
    },
  });

  function validate() {
    const nextName = name.trim();
    const nextEmail = email.trim();
    const nameMessage = nextName ? "" : "Name is required.";
    const emailMessage = nextEmail.includes("@")
      ? ""
      : "Enter a valid email address.";
    setNameError(nameMessage);
    setEmailError(emailMessage);
    return !nameMessage && !emailMessage;
  }

  return (
    <Form
      className={styles.form}
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        if (!validate()) return;
        update.mutate();
      }}
    >
      <Stack gap={9}>
        <FormGroup legendText="Customer">
          <Stack gap={7}>
            <TextInput
              id="customer-name"
              labelText="Name"
              value={name}
              invalid={Boolean(nameError)}
              invalidText={nameError}
              onBlur={() => setNameError(name.trim() ? "" : "Name is required.")}
              onChange={(event) => setName(event.target.value)}
            />
            <TextInput
              id="customer-email"
              labelText="Email"
              type="email"
              value={email}
              invalid={Boolean(emailError)}
              invalidText={emailError}
              onBlur={() =>
                setEmailError(
                  email.trim().includes("@")
                    ? ""
                    : "Enter a valid email address.",
                )
              }
              onChange={(event) => setEmail(event.target.value)}
            />
          </Stack>
        </FormGroup>

        {update.isError ? (
          <InlineNotification
            kind="error"
            title="Could not save the customer"
            subtitle={update.error.message}
          />
        ) : null}

        <ButtonSet>
          <Button type="submit" disabled={update.isPending}>
            {update.isPending ? "Saving…" : "Save changes"}
          </Button>
          <Button
            kind="secondary"
            type="button"
            onClick={() => router.push("/customers")}
          >
            Cancel
          </Button>
        </ButtonSet>
      </Stack>
    </Form>
  );
}
