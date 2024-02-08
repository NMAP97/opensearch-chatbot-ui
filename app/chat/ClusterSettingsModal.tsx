import React, { useContext, useEffect } from 'react'
import { Button, Dialog, Flex, TextArea, TextField, Text } from '@radix-ui/themes'
import { useForm } from 'react-hook-form'
import { ChatContext, ClusterSettings } from '@/components'

const ClusterSettingsModal = () => {
    const {
        isClusterSettingsModalOpen: open,
        clusterSettings,
        onClusterSettingsChange,
        closeClusterSettingsModal
    } = useContext(ChatContext)

    const { register, handleSubmit, setValue } = useForm()

    const formSubmit = handleSubmit((values: any) => {
        closeClusterSettingsModal?.();
        onClusterSettingsChange?.(values as ClusterSettings)
    })

    useEffect(() => {
        if (clusterSettings) {
            setValue('endpoint', clusterSettings.endpoint, { shouldTouch: true })
            // setValue('context_size', clusterSettings.context_size, { shouldTouch: true })
            // setValue('interaction_size', clusterSettings.interaction_size, { shouldTouch: true })
        }
    }, [clusterSettings, setValue])

    const isNewSetup = clusterSettings == null;

    return (
        <Dialog.Root open={open}>
            <Dialog.Content size="4">
                <Dialog.Title>{(isNewSetup ? "Setup" : "Update") + " Cluster Settings"}</Dialog.Title>
                <Dialog.Description size="2" mb="4"></Dialog.Description>
                <form onSubmit={formSubmit}>
                    <Flex direction="column" gap="3">
                        <Text as='label'>Endpoint</Text>
                        <TextField.Input type="url" placeholder="please enter a valid http url" {...register('endpoint', { required: true })} />
                        {/* <Text as='label'>Context Size</Text>
                        <TextField.Input type="number" min="1" placeholder="please enter a valid number" {...register('context_size', { required: true })} />
                        <Text as='label'>Interaction Size</Text>
                        <TextField.Input type="number" min="1" placeholder="please enter a valid number" {...register('interaction_size', { required: true })} />
                        <TextField.Input placeholder="User Name" {...register('username', { required: false })} />
                        <TextField.Input type="password" placeholder="Password" {...register('password', { required: false })} /> */}
                    </Flex>
                    <Flex gap="3" mt="4" justify="end">
                        <Dialog.Close>
                            <Button variant="soft" type="button" color="gray" onClick={closeClusterSettingsModal}>
                                Cancel
                            </Button>
                        </Dialog.Close>
                        <Dialog.Close>
                            <Button variant="soft" type="submit">
                                Save
                            </Button>
                        </Dialog.Close>
                    </Flex>
                </form>
            </Dialog.Content>
        </Dialog.Root>
    )
}

export default ClusterSettingsModal

