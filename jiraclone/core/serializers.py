from rest_framework import serializers
from .models import User, Role
from .models import Ticket

class UserSerializer(serializers.ModelSerializer):
    role = serializers.StringRelatedField(allow_null=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name",
                  "role", "created_at", "modified_at"]

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=7)
    role = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    class Meta:
        model = User
        fields = ["username", "email", "first_name", "last_name", "password", "role"]

    def create(self, validated_data):
        role_name = validated_data.pop("role", None)
        raw_password = validated_data.pop("password")

        user = User(**validated_data)
        user.set_password(raw_password)
        user.save()

        if role_name:
            role, _ = Role.objects.get_or_create(name=role_name.strip())
            user.role = role
            user.save()

        return user



class TicketSerializer(serializers.ModelSerializer):
    reporter = serializers.StringRelatedField(read_only=True)
    assignee = serializers.StringRelatedField(read_only=True)
    assignee_id = serializers.PrimaryKeyRelatedField(
        source="assignee",
        queryset=User.objects.all(),
        required=False,
        allow_null=True,
        write_only=True,
    )

    class Meta:
        model = Ticket
        fields = [
            "id",
            "title",
            "description",
            "status",
            "priority",        
            "reporter",
            "assignee",
            "assignee_id",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "reporter", "assignee", "created_at", "updated_at"]

    def create(self, validated_data):
        validated_data["reporter"] = self.context["request"].user
        return super().create(validated_data)