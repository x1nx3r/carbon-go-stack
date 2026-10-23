"use client";

import {
  Button,
  ButtonSet,
  Form,
  FormGroup,
  InlineNotification,
  Stack,
  TextInput,
} from "@carbon/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { customersClient } from "@/lib/connect";
import styles from "@/components/form.module.scss";

export function CustomerForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");

  const create = useMutation({
    mutationFn: () =>
      customersClient.createCustomer({ name: name.trim(), email: email.trim() }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["customers"] });
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
        create.mutate();
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

        {create.isError ? (
          <InlineNotification
            kind="error"
            title="Could not create the customer"
            subtitle={create.error.message}
          />
        ) : null}

        <ButtonSet>
          <Button type="submit" disabled={create.isPending}>
            {create.isPending ? "Creating…" : "Create customer"}
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
