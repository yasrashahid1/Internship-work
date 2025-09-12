from rest_framework import serializers
from .models import User, Role, Comment
from .models import Ticket, Tag

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


class UserSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email"]



class CommentSerializer(serializers.ModelSerializer):   
    user = UserSimpleSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ["id", "user", "text", "created_at"]


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag 
        fields = ["id", "name"]



class TicketSerializer(serializers.ModelSerializer):
    reporter = serializers.CharField(source="reporter.username", read_only=True)
    assignee = serializers.CharField(source="assignee.username", read_only=True, default=None)

    assignee_id = serializers.PrimaryKeyRelatedField(
        source="assignee",
        queryset=User.objects.all(),
        required=False,
        allow_null=True,
        write_only=True,
    )

    comments = CommentSerializer(many=True, read_only=True)

    tags = TagSerializer(many=True, read_only=True)
    tag_ids = serializers.PrimaryKeyRelatedField(
    source="tags",
    queryset=Tag.objects.all(),  
    many=True,
    required=False,
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
            "tags",
            "tag_ids",
            "comments",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "reporter", "assignee", "comments", "created_at", "updated_at"]




    def create(self, validated_data):
        tags = validated_data.pop("tags", [])
        validated_data["reporter"] = self.context["request"].user
        ticket = super().create(validated_data)
        if tags:
            ticket.tags.set(tags)
        return ticket

    def update(self, instance, validated_data):
        tags = validated_data.pop("tags", None)
        ticket = super().update(instance, validated_data)
        if tags is not None:
            ticket.tags.set(tags)
        return ticket



